import passport from 'passport';
import express from 'express';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['public_profile', 'email'] }));

router.post('/login');
router.post('/signup');

export default router;
