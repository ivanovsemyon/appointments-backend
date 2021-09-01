const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use("/", require("./modules/routes/routes"));

app.listen(8000, () => console.log("Port 8000 started"));
