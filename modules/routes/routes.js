const { Router } = require('express');
const mongoose = require("mongoose");
const router = Router();
const Schema = mongoose.Schema;

const userSchema = new Schema({
  login: String,
  password: String
})

mongoose.connect(
  'mongodb+srv://semyonivanov:semyonivanov@cluster0.6g7e8.mongodb.net/Appointments?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

const User = mongoose.model('users', userSchema);

module.exports.auth.post('/register', async (req, res) => {
  const {login, password} = req.body;
});

