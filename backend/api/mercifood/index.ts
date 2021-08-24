import {config} from "dotenv";
config();
import express, {Express} from "express";
import bodyParser from "body-parser";
import {buildRoutes} from "./routes";
import * as socketio from "socket.io";
import { Socket } from "dgram";
import { NextFunction } from "connect";


//buildSeeders(); //populate database table with random data

const app: Express = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
      origins: ['http://localhost:4200']
  }
});

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});
  
buildRoutes(app);

const port = process.env.PORT || 3000;


io.on("connection", function(socket: any) {
  console.log("a user connected");
  socket.on('message', (message_text:any) => {
    socket.broadcast.emit('message-broadcast', message_text);
   });
});
app.listen(port, function() {
    console.log(`Listening on ${port}...`);
});

http.listen(3001, function() {
  console.log(`Listening on 3001...`);
});
