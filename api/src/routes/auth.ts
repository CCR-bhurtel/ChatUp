import passport from 'passport';
import express from 'express';
import catchAsync from '../utils/catchAsync';
import createSendToken from '../utils/createSendToken';
import { PopulatedUser } from '../Types/User';

const router = express.Router();

router.get('/google', catchAsync(passport.authenticate('google', { scope: ['profile', 'email'] })));

router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_photos'] }));

router.get('/googleredirect', passport.authenticate('google'), (req, res) => {
    createSendToken(req.user as PopulatedUser, res);
});

router.get('/facebookredirect', passport.authenticate('facebook'), (req, res) => {
    createSendToken(req.user as PopulatedUser, res);
});

router.post('/login');
router.post('/signup');

export default router;
