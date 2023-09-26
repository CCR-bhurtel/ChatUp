import multer from 'multer';
import { PopulatedUser } from '../Types/User';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/../../public/images/userImages/`);
    },

    filename(req, file, cb) {
        const user = req.user;
        const fileName = 'userimage_' + user?._id.toString() + path.extname(file.originalname);
        cb(null, fileName);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const types = /png|jpg|jpeg|webp|gif|webp|svg/;
        const extName = types.test(path.extname(file.originalname).toLocaleLowerCase());
        const mimetype = types.test(file.mimetype);
        if (extName && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only supported png,jpeg,jpg,gif,webp and svg format image'));
        }
    },
});

export default upload;
