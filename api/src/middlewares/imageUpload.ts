import multer from "multer";
import path from "path";
import { v4 } from "uuid";

const storage = (folder: string) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${__dirname}/../../public/images/${folder}/`);
    },

    filename(req, file, cb) {
      const user = req.user;
      const fileName =
        `${folder}_` +
        user?._id.toString() +
        v4() +
        path.extname(file.originalname);
      cb(null, fileName);
    },
  });

const upload = (folderName: string) =>
  multer({
    storage: storage(folderName),

    fileFilter: (req, file, cb) => {
      const types = /png|jpg|jpeg|webp|gif|webp|svg/;
      const extName = types.test(
        path.extname(file.originalname).toLocaleLowerCase()
      );
      const mimetype = types.test(file.mimetype);
      if (extName && mimetype) {
        cb(null, true);
      } else {
        cb(
          new Error("Only supported png,jpeg,jpg,gif,webp and svg format image")
        );
      }
    },
  });

export default upload;
