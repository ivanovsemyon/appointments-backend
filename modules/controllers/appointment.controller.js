const { Schema, connect, model } = require("mongoose");

const appointmentsSchema = new Schema({
  name: String,
  doctor: String,
  date: String,
  complaint: String,
});

connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Appointments = model("appointments", appointmentsSchema);

module.exports.getAllAppointments = async (req, res) => {
  if (req.decoded) {
    try {
      await Appointments.find().then((result) => {
        res.send(result);
      });
    } catch (e) {
      res.status(400).send({ massage: "При загрузке произошла ошибка" });
    }
  }
};

module.exports.createAppointment = async (req, res) => {
  const { name, doctor, date, complaint, decoded } = req.body;
  if (decoded) {
    try {
      if (name && doctor && date && complaint) {
        await Appointments.create({
          name,
          doctor,
          date,
          complaint,
        });
        await Appointments.find().then((result) =>
          res.status(200).send(result)
        );
      }
    } catch (err) {
      res.status(400).send({ massage: "Ошибка", err });
    }
  }
};

module.exports.editAppointment = async (req, res) => {
  const body = req.body;
  if (req.decoded) {
    if (body._id) {
      if (
        body.name !== "" &&
        body.doctor !== "" &&
        body.date !== "" &&
        body.complaint !== ""
      ) {
        await Appointments.updateOne({ _id: body._id }, { ...body });
        await Appointments.find().then((result) =>
          res.status(200).send(result)
        );
      } else {
        res.status(400).send({ error: "Все поля должны быть заполнены" });
      }
    } else {
      res.status(400).send({ error: "Некорректные данные" });
    }
  }
};

module.exports.deleteAppointments = async (req, res) => {
  if (req.decoded) {
    if (req.query.id) {
      try {
        await Appointments.deleteOne({ _id: req.query.id });
        await Appointments.find().then((result) => {
          res.status(200).send(result);
        });
      } catch (e) {
        res.status(400).send({ error: e });
      }
    } else {
      res.status(400).send({ error: "Некорректный id" });
    }
  }
};
