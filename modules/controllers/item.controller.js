const { Schema, connect, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  login: String,
  password: String,
});

connect(
  "mongodb+srv://semyonivanov:semyonivanov@cluster0.6g7e8.mongodb.net/Appointments?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const User = model("users", userSchema);

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

    await User.create({
      login: login,
      password: hashedPassword,
    });
    res.send("Пользователь создан");
  } else {
    res.status(400).send("Введите корректные данные");
  }
};
