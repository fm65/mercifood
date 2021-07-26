import {config} from "dotenv";
config();
import express, {Express} from "express";
import bodyParser from "body-parser";
import {buildRoutes} from "./routes";
//import {buildSeeders} from "./seeders";


//buildSeeders(); //populate database table with random data

const app: Express = express();

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
  
buildRoutes(app);

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Listening on ${port}...`);
});