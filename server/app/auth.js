module.exports = (server, app, onlineUsers) => {
    const passport      = require('passport');
    const passportfb    = require('passport-facebook');
    const passportLocal = require('passport-local');
    const userDM        = require('../model/database-user.js');
    const path          = require('path');
    
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
            callbackURL: 'https://chattogether.herokuapp.com/login-facebook',
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
            
            userDM.newUser(user, (err, result, userG) => {
                if(result === 'success'){
                    return done(null, userG);
                }else if(result === 'exists'){
                    userDM.findUserByEmail(user.email, (error, rs) => {
                        done(null, rs);
                    })
                }
            })
        }
    )) 

    passport.serializeUser((user, done) => {
        // console.log(`onlineUsers: ${onlineUsers}`);
        // console.log(`New online user`);
        // console.log(user.id)
        // if(onlineUsers.indexOf(user.id) === -1){
        //     onlineUsers.push(user.id);
        //     console.log("onlineUsers " + onlineUsers);
        // }

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
        userDM.newUser(req.body, (err, result, user) => {
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
            }else{
                res.send({err: false, message: 'Register success'});
            }
        })
    })

    app.get('/auth/fb', passport.authenticate('facebook', {scope: ['email']}));
    app.get('/login-facebook', passport.authenticate('facebook', {
        failureRedirect: '/sign-in', successRedirect: '/home'
    }));


    app.get('/logout', (req, res) => {
        console.log('logout');

        req.logout();
        res.send("");
    })
}