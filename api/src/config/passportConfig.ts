import passport from 'passport';
import googleOauth from 'passport-google-oauth20';
import User from '../database/Model/User';
import {
    FACEBOOK_OAUTH_CLIENT_ID,
    FACEBOOK_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET,
} from './keys';
import { Strategy } from 'passport-facebook';

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    if (user) {
        done(null, user.id);
    } else {
        done(null);
    }
});

passport.use(
    new googleOauth.Strategy(
        {
            clientID: GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: '/api/v1/auth/googleredirect',
        },
        async (accessToken, refreshToken, profile, done) => {
            const currentUser = await User.findOne({ googleId: profile.id });
            if (!currentUser) {
                const user = await User.create({
                    googleId: profile.id,

                    name: profile.displayName,
                    email: profile.emails?.length ? profile.emails[0].value : '',
                    profilePic: profile.photos?.length ? profile.photos[0].value : '',
                    registerType: 'google',
                    location: '',
                    blockedUsers: [],
                    verified: true,
                });
                done(null, user);
            } else {
                //pass for serializing
                done(null, currentUser);
            }
        }
    )
);

passport.use(
    new Strategy(
        {
            clientID: FACEBOOK_OAUTH_CLIENT_ID,
            clientSecret: FACEBOOK_OAUTH_CLIENT_SECRET,
            callbackURL: '/api/v1/auth/facebookredirect',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const currentUser = await User.findOne({ facebookId: profile.id });
                if (!currentUser) {
                    const user = await User.create({
                        facebookId: profile.id,

                        name: profile.displayName,
                        email: profile.emails?.length ? profile.emails[0].value : '',
                        profilePic: profile.photos?.length ? profile.photos[0].value : '',
                        registerType: 'facebook',
                        location: '',
                        blockedUsers: [],
                        verified: true,
                    });
                    done(null, user);
                } else {
                    done(null, currentUser);
                }
            } catch (err) {
                console.log(err);
            }
        }
    )
);
