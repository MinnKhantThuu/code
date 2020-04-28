let express = require('express');
let app = express();
let bodyParser = require('body-parser');
require('dotenv').config();
let jwt = require('jsonwebtoken');
let passport = require('passport');

let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

let userMap = new Map();
userMap.set('aa@gmail.com', { name: 'aa', email: 'aa@gmail.com', password: '123123' });
userMap.set('bb@gmail.com', { name: 'bb', email: 'bb@gmail.com', password: '123123' });

let myStrategy = new JwtStrategy(opts, (payload, done) => {
    let user = userMap.get(payload.email);
    if (user != null || user != undefined)
        done(null, user);
    else
        done('That Email is false', null);
})

passport.use(myStrategy);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user = userMap.get(email);
    if (user != null || user != undefined) {
        if (user.password == password) {
            let payload = { email: email };
            let token = jwt.sign(payload, process.env.SECRET);
            res.json({ token: token });
        } else {
            res.send({data:'Wrong Password'});
        }
    } else {
        res.send({ data: 'Email Wrong' });
    }


})

app.get('/free', (req, res) => {
    res.send('Free Route');
});

app.get('/secret', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('Secret Route');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});