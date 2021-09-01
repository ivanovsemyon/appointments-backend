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
  const { login, password } = req.body;
  const passwordRegex = /^(?=.*[\d])[A-Za-z0-9].{5,}$/;

  const validLogin = login.length >= 6;
  const validPassword = passwordRegex.test(password);
  const candidate = await User.findOne({ login });

  if (!validLogin) {
    return res.status(400).send("Длина логина должна быть не менее 6 символов");
  }
  if (!validPassword) {
    return res
      .status(400)
      .send(
        "Длина пароля должна быть не меньше 6 символов, обязательно состоять из латинских символов и содержать число"
      );
  }

  if (candidate) {
    return res
      .status(400)
      .send({ error: { message: "Такой логин уже существует" } });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    login: login,
    password: hashedPassword,
  });
  res.send("Пользователь создан");
};
