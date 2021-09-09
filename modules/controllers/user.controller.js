const { Schema, connect, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  login: String,
  password: String,
  token: String,
});

connect(
  "mongodb+srv://semyonivanov:semyonivanov@cluster0.6g7e8.mongodb.net/Appointments?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const User = model("users", userSchema);

module.exports.verifyToken = (req, res) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    req.user = jwt.verify(token, "secret");
    res.send({ isLogin: true });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports.register = async (req, res) => {
  const { login, password, repeatPassword } = req.body;
  if (login && password && repeatPassword) {
    const passwordRegex = /^(?=.*[\d])[A-Za-z0-9].{5,}$/;

    const validLogin = login.length < 6;
    const validPassword = passwordRegex.test(password);
    const candidate = await User.findOne({ login });

    if (validLogin) {
      return res
        .status(400)
        .send({ login: "Длина логина должна быть не менее 6 символов" });
    }
    if (!validPassword) {
      return res.status(400).send({
        password:
          "Длина пароля должна быть не меньше 6 символов, обязательно состоять из латинских символов и содержать число",
      });
    }
    if (password !== repeatPassword) {
      return res.status(400).send({
        repeatPassword: "Пароли не совпадают",
      });
    }

    if (candidate) {
      return res.status(400).send({ login: "Такой логин уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 4);

    const user = await User.create({
      login: login,
      password: hashedPassword,
    });

    user.token = await jwt.sign(
      { login: user.login, password: user.password },
      "secret"
    );
    res.status(201).json({ login: user.login, token: user.token });
  } else {
    res.status(400).send("Введите корректные данные");
  }
};

module.exports.login = async (req, res) => {
  const { login, password } = req.body;
  if (login && password) {
    const user = await User.findOne({ login });
    if (user && (await bcrypt.compare(password, user.password))) {
      user.token = await jwt.sign(
        { login: user.login, token: user.token },
        "secret"
      );
      res.status(201).json({ login: user.login, token: user.token });
    } else {
      res.status(400).send({ error: "Логин или пароль не верны" });
    }
  } else {
    res.status(400).send({ error: "Недостаточно данных" });
  }
};
