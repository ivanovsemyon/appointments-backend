const express = require("express");
const router = express.Router();

const {
  verifyToken,
  register,
  login,
} = require("../controllers/user.controller");

const {
  getAllAppointments,
  createAppointment,
  editAppointment,
  deleteAppointments,
} = require("../controllers/appointment.controller");

router.post("/verify", verifyToken);
router.post("/registrationUser", register);
router.post("/loginUser", login);
router.get("/getAllAppointments", getAllAppointments);
router.post("/createAppointment", createAppointment);
router.post("/editAppointment", editAppointment);
router.delete("/deleteAppointments", deleteAppointments);
module.exports = router;
