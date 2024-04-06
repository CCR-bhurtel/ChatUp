/* eslint-disable import/first */

import dotenv from "dotenv";
import { PeerServer } from "peer";
dotenv.config();

import app from "./app";
import connectDb from "./database/connect";
import { CLIENT_URI, JWT_SECRET, PEER_SERVER_PORT, PORT } from "./config/keys";

import swagger from "./swagger";
import WS from "./services/Websocket";

connectDb()
  .then(() => {})
  .catch((err: any) => {
    console.log(err);
  });

swagger(app);
let server = app.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
  let websocket = new WS();
  websocket.createConnection(server)
  
});
let peerServer = PeerServer({ port: PEER_SERVER_PORT }, () => {
  console.log(`Peer server running in port ${PEER_SERVER_PORT}`);
});
peerServer.on("connection", (peer) => {});
