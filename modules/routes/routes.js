const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getAllAppointments,
  createAppointment,
  editAppointment,
  deleteAppointments,
} = require('../controllers/item.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/general', getAllAppointments);
router.post('/createAppointment', createAppointment);
router.post('/editAppointment', editAppointment);
router.post('/deleteAppointments', deleteAppointments);
module.exports = router;
