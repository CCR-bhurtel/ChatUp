import express from "express";
import sendMessage from "../controllers/chat/sendMessage";
import upload from "../middlewares/imageUpload";
import sendImageMessage from "../controllers/chat/sendImageMessages";

const router = express.Router();

// router.get('/', (req, res) => {
//     return res.send('Hello world from chat router');
// });

router.post("/", sendMessage);

router.post(
  "/imagemessage",
  upload("chatImages").array("files"),
  sendImageMessage
);

const chatRouter = router;

export default chatRouter;
