import express from 'express';
import authCheck from '../middlewares/authCheck';
import upload from '../utils/imageUpload';
import { profileImageUpload } from '../controllers/user/userProfile';

const router = express.Router();

router.get('/', authCheck, (req, res) => {
    return res.status(200).json(req.user);
});

router.post('/profileimage', authCheck, upload.single('image'), profileImageUpload);

const userRouter = router;

export default userRouter;
