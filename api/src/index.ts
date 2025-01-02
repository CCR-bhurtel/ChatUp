/* eslint-disable import/first */

import dotenv from "dotenv";
import { PeerServer } from "peer";
dotenv.config();

import app from "./app";
import connectDb from "./database/connect";
import { CLIENT_URI, JWT_SECRET, PEER_SERVER_PORT, PORT } from "./config/keys";

import swagger from "./swagger";
import WS from "./lib/Websocket";
import logger from "./logger/winston.logger";

connectDb()
  .then(() => {})
  .catch((err: any) => {
    logger.error("Error connecting to database", err);
  });

swagger(app);
let server = app.listen(PORT, () => {
  logger.info(`app listening to port ${PORT}`);
  let websocket = new WS();
  websocket.createConnection(server, CLIENT_URI);
});
let peerServer = PeerServer({ port: PEER_SERVER_PORT }, () => {
  logger.info(`Peer server running in port ${PEER_SERVER_PORT}`);
});
peerServer.on("connection", (peer) => {});
