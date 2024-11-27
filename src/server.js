import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connectDB from "./config/ConnectDB";
const cors = require("cors");
require("dotenv").config();

let port = process.env.PORT || 6969;
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
viewEngine(app);
initWebRoutes(app);

connectDB();

app.listen(port, () => {
  console.log(`BackEnd Nodejs is running on port ${port}`);
});
