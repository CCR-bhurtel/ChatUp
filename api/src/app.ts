/* eslint-disable import/first */
import express from "express";
import path from "path";

import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import cookieSession from "cookie-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import ErrorControllerDev from "./controllers/error/DevErrorController";
import ErrorControllerProd from "./controllers/error/ProdErrorController";
import "./config/passportConfig";
import { COOKIE_EXPIRES_IN, COOKIE_KEY } from "./config/keys";
import authCheck from "./middlewares/authCheck";
import roomRouter from "./routes/room";
import chatRouter from "./routes/chat";
import cors from "cors";
const app = express();

const publicPath: string = path.resolve(__dirname, "../public");

app.use(cookieParser());
app.use(express.json());
app.use(express.static(publicPath));

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'templates'));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(
  cookieSession({
    maxAge: parseInt(COOKIE_EXPIRES_IN) * 24 * 60 * 60,
    keys: [COOKIE_KEY],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/user", authCheck, userRouter);

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/room", authCheck, roomRouter);

app.use("/api/v1/chat", authCheck, chatRouter);

app.get("/", (req, res) => {
  res.send("<h1> Hello world</h1>");
});

if (process.env.NODE_ENV === "development") {
  app.use(new ErrorControllerDev().controller);
} else {
  app.use(new ErrorControllerProd().controller);
}
export default app;
