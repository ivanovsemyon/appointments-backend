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
router.get("/getAllAppointments", verifyToken, getAllAppointments);
router.post("/createAppointment", verifyToken, createAppointment);
router.post("/editAppointment", verifyToken, editAppointment);
router.delete("/deleteAppointments", verifyToken, deleteAppointments);
module.exports = router;
