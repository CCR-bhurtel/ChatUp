import passport from 'passport';
import express from 'express';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

router.get('/google', catchAsync(passport.authenticate('google', { scope: ['profile', 'email'] })));

router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_photos'] }));

router.get('/googleredirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
});

router.get('/facebookredirect', passport.authenticate('facebook'), (req, res) => {
    res.redirect('/');
});

router.post('/login');
router.post('/signup');

export default router;
