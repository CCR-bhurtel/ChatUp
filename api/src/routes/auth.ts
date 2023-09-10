import passport from 'passport';
import express from 'express';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

router.get('/google', catchAsync(passport.authenticate('google', { scope: ['profile', 'email'] })));

router.get('/googleredirect', (req, res) => {
    res.redirect('/');
});

router.post('/login');
router.post('/signup');

export default router;
