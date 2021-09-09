const { Schema, connect, model } = require("mongoose");

const appointmentsSchema = new Schema({
  name: String,
  doctor: String,
  date: String,
  complaint: String,
});

connect(
  "mongodb+srv://semyonivanov:semyonivanov@cluster0.6g7e8.mongodb.net/Appointments?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Appointments = model("appointments", appointmentsSchema);

module.exports.getAllAppointments = async (req, res) => {
  Appointments.find().then((result) => {
    res.send(result);
  });
};

module.exports.createAppointment = async (req, res) => {
  const { name, doctor, date, complaint } = req.body;
  if (name && doctor && date && complaint) {
    await Appointments.create({
      name: name,
      doctor: doctor,
      date: date,
      complaint: complaint,
    });
    Appointments.find().then((result) => res.send(result));
  } else {
    res.status(400).send({ error: "Заполните все поля" });
  }
};

module.exports.editAppointment = async (req, res) => {
  const body = req.body;
  if (body._id) {
    await Appointments.updateOne({ _id: body._id }, { ...body });
    await Appointments.find().then((result) => res.send(result));
  } else {
    res.status(400).send({ error: "Некорректные данные" });
  }
};

module.exports.deleteAppointments = async (req, res) => {
  if (req.query.id) {
    await Appointments.deleteOne({ _id: req.query.id });
    Appointments.find().then((result) => res.send(result));
  } else {
    res.status(400).send({ error: "Некорректный id" });
  }
};
