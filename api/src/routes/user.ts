import express from 'express';
import upload from '../middlewares/imageUpload';
import { blockUser, profileImageUpload, unblockUser, userProfileUpdate } from '../controllers/user/userProfile';
import { changePreferences } from '../controllers/user/userSettings';

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).json(req.user);
});

router.post('/profileimage', upload.single('image'), profileImageUpload);

router.put('/profile', userProfileUpdate);

router.put('/block', blockUser);

router.put('/unblock', unblockUser);

router.put('/preferences', changePreferences);

const userRouter = router;

export default userRouter;
