require('./node_modules/dotenv').config();
let express = require('./node_modules/express'),
    app = express(),
    path = require('path'),
    jwt = require('./node_modules/jsonwebtoken'),
    passport = require('./node_modules/passport'),
    bodyParser = require('./node_modules/body-parser'),
    JwtStrategy = require('./node_modules/passport-jwt').Strategy,
    ExtractJwt = require('./node_modules/passport-jwt').ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let userMap = new Map();
userMap.set('aa@gmail.com', { name: 'aa', email: 'aa@gmail.com', pass: '123123' });
userMap.set('bb@gmail.com', { name: 'bb', email: 'bb@gmail.com', pass: '123123' });


let myStrategy = new JwtStrategy(opts, function (payload, done) {
    let user = userMap.get(payload.email);
    if(user != null || user != undefined){
        done(null,user);
    }else{
        done('No user with that email',null);
    }
});

passport.use(myStrategy);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/about.html');
});

app.post('/login', (req, res) => {
    let email = req.body.email;
    let passwrod = req.body.password;
    // res.send(`Email is ${email} and password is ${passwrod}`);

    let payload = { email: email };
    let token = jwt.sign(payload, process.env.SECRET);
    res.json({ token: token });
});

app.get('/free',(req,res)=>{
    res.send('Data Free');
})

app.get('/secret',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.send('Secret Data');
})

app.use(express.static(path.join('assets')));      //define assets as media path

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);      //use string literal
})