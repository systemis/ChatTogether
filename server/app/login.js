module.exports = (app) => {
    var passport      = require('passport');
    var passportfb    = require('passport-facebook');
    var passportLocal = require('passport-local');
    var userDM        = require('../model/database-user.js');
    var path          = require('path');

    
    app.use(passport.initialize());
    app.use(passport.session());

    // Login with email 
    passport.use(new passportLocal.Strategy((username, password, done) => {
        var user = { username: username };
        userDM.checkLogin(username, password, (err, message, result) => {
            console.log("Result login: " + message);
            switch(message){
                case "OK":
                    delete result.password;
                    user = result;
                    return done(null, user);
                case "CORRECT":
                    return done("Password khong dung", false);
                case "NOT_REGISTER":
                    return done("Email chua duoc dang ky", false);
                default:
                    return done("Co mot so loi xay ra", false);
            }
        })
    }))

    // Login with facebook 
    passport.use(new passportfb(
        {
            clientID: '167157813823645',
            clientSecret: '38a2f71294d8e6148b3146d1b0ecc782',
            callbackURL: 'http://localhost:3000/login-facebook',
            profileFields: ['email', 'gender', 'locale', 'displayName', 'photos', 'birthday']
        },
        function(accessToken, refreshToken, profile, done){
            const info = profile._json; console.log(info);
            const user = {
                id: info.id,
                name: info.name,
                email: info.email,
                password: info.id,
                gender: info.gender,
                language: info.locale,
                birthday: info.birthday,
                avatar: `https://graph.facebook.com/v2.3/${info.id}/picture?type=large`
            }
            
            userDM.newUser(user, (err, result) => {
                done(null, user);
            })
        }
    )) 

    passport.serializeUser((user, done) => {
        console.log(user);
        done(null, user);
    })
    passport.deserializeUser((user, done) => {
        done(null, user);
    })

    // Handling when client sign in 
    app.post('/sign-in', passport.authenticate('local'), (req, res) => {
        res.redirect('/home');
    })

    app.post('/sign-up', (req, res) => {
        userDM.newUser(req.body, (err, result) => {
            console.log("Co nguoi dang dang ky bang email");
            console.log(req.body);
            if(err){
                switch(result){
                    case 'exists': 
                        res.send({err: true, message: "Account already exists"});
                        break;
                    default:
                        res.send({err: true, message: "Some error, try again after 5 minute"});
                        break
                }
            }

            res.send({err: false, message: 'Register success'});
        })
    })

    app.get('/auth/fb', passport.authenticate('facebook', {scope: ['email']}));
    app.get('/login-facebook', passport.authenticate('facebook', {
        failureRedirect: '/sign-in', successRedirect: '/home'
    }));
}