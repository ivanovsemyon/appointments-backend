const { Schema, connect, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  login: String,
  password: String,
  token: String,
});

const appointmentsSchema = new Schema({
  name: String,
  doctor: String,
  date: String,
  complaint: String,
});

connect(
  'mongodb+srv://semyonivanov:semyonivanov@cluster0.6g7e8.mongodb.net/Appointments?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Appointments = model('appointments', appointmentsSchema);
const User = model('users', userSchema);

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
        .send({ login: 'Длина логина должна быть не менее 6 символов' });
    }
    if (!validPassword) {
      return res.status(400).send({
        password:
          'Длина пароля должна быть не меньше 6 символов, обязательно состоять из латинских символов и содержать число',
      });
    }
    if (password !== repeatPassword) {
      return res.status(400).send({
        repeatPassword: 'Пароли не совпадают',
      });
    }

    if (candidate) {
      return res.status(400).send({ login: 'Такой логин уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 4);

    const user = await User.create({
      login: login,
      password: hashedPassword,
    });

    user.token = await jwt.sign(
      { login: user.login, password: user.password },
      'secret',
      {
        expiresIn: '2h',
      }
    );
    res.status(201).json({ login: user.login, token: user.token });
  } else {
    res.status(400).send('Введите корректные данные');
  }
};

module.exports.login = async (req, res) => {
  const { login, password } = req.body;
  if (login && password) {
    const user = await User.findOne({ login });
    if (user && (await bcrypt.compare(password, user.password))) {
      user.token = await jwt.sign(
        { login: user.login, token: user.token },
        'secret',
        {
          expiresIn: '2h',
        }
      );
      res.status(201).json({ login: user.login, token: user.token });
    } else {
      res.status(400).send({ error: 'Логин или пароль не верны' });
    }
  } else {
    res.status(400).send({ error: 'Недостаточно данных' });
  }
};

module.exports.getAllAppointments = async (req, res) => {
  Appointments.find().then((result) => {
    res.send(result);
  });
};

module.exports.createAppointment = async (req, res) => {
  const { name, doctor, date, complaint } = req.body;
  await Appointments.create({
    name: name,
    doctor: doctor,
    date: date,
    complaint: complaint,
  });
  Appointments.find().then((result) => res.send(result));
};

module.exports.editAppointment = async (res, req) => {
  const body = req.body;
  Appointments.updateOne({ _id: body._id }, { ...body });
  Appointments.find().then((result) => res.send(result));
};

module.exports.deleteAppointments = async (res, req) => {
  await Appointments.deleteOne({ _id: req.query.id });
  Appointments.find.then((result) => res.send(result));
};
