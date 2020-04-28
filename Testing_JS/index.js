let http = require('http');
let url = require('url');
let qs = require('querystring');
let fs = require('fs');
let path = require('path');
require('./node_modules/dotenv').config();

let responder = (req, res, param) => {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end(param);
}


let meme = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/js',
    '.png' : 'image/png',
    '.jpg' : 'image/jpeg',
    '.json' : 'application/json',
    '.gif' : 'image/gif',
}

let fileReader = (filepath, res) => {
    // fs.access(filepath, fs.F_OK, err => {
    //     if (err) throw err;
    //     fs.readFile(filepath, (err, data) => {
    //         if (err) throw err;
    //         res.writeHead(200, { 'Content-type': 'text/html' });
    //         res.end(data);
    //     })
    // })
}

let route = {
    'GET': {
        '/': (req, res) => {
            // let filepath = __dirname + '/home.html';
            // fileReader(filepath,res);
        },
        '/home.html': (req, res) => {
            // let filepath = __dirname + '/home.html';
            // fileReader(filepath,res);
        },
        '/about.html': (req, res) => {
            // let filepath = __dirname + '/about.html';
            // fileReader(filepath,res);
        }
    },
    'POST': {
        '/': (req, res) => {
            responder(req, res, `POST method => name is ${params.query.name} and ${params.query.age}`);

        },
        '/home': (req, res) => {
            responder(req, res, `POST method => name is ${params.query.name} and ${params.query.age}`);
        },
        '/about': (req, res) => {
            responder(req, res, `POST method => name is ${params.query.name} and ${params.query.age}`);

        },
        '/api/login': (req, res) => {
            let body = [];
            req.on('data', data => {
                body += data;
            })
            req.on('end', () => {
                let query = qs.parse(body);
                console.log(`Email is ${query.email} and Password is ${query.password}`);
                res.end('Login Successfully');
            })
        }
    },
    'NoRoute': (req, res) => {
        responder(req, res, `<h1>404 page not found</h1>`)
    }
}

let start = (req, res) => {
    // let method = req.method;
    // let params = url.parse(req.url, true);
    // let resolveRoute = route[method][params.pathname];

    // if (resolveRoute != null && resolveRoute != undefined) {
    //     resolveRoute(req, res, params);
    // } else {
    //     route['NoRoute'](req, res);
    // }
    let param = url.parse(req.url,true);
    let originPath = __dirname + param.pathname;
    let ext = path.extname(originPath);
    fs.access(originPath, fs.F_OK, err => {
        if (err) throw err;
        fs.readFile(originPath, (err, data) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-type': meme[ext] });
            res.end(data);
        })
    })
    console.log(originPath);
}


let server = http.createServer(start);

server.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});

let http = require('http');
let fs = require('fs');         //File System
let url = require('url');       //url parse
let path = require('path');     //extension name
let qr = require('./node_modules/qr-image');   //qrCode
let bcrypt = require('./node_modules/bcrypt'); //password encode decode
require('./node_modules/dotenv').config();

let meme = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/js',
    '.json' : 'application/json',
    '.png' : 'image/png',
    '.jpg' : 'image/jpg',
    '.gif' : 'image/gif'
}

let encode = (plainPass)=>{                         //to password encode
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(plainPass,salt,(err,hash)=>{
                if(err) reject(err);
                resolve(hash);
            })
        })
    })
}

let decode = (plainPass,hashPass)=>{                // password compare with encoded password
    return new Promise((resolve,reject)=>{
        bcrypt.compare(plainPass,hashPass,(err,bool)=>{
            if(err) reject(err);
            resolve(bool);
        })
    })
}

encode('123')
.then(encode=>decode('1234',encode))        //promise chain
.then(bool=>console.log(bool))
.catch(err=>console.log(err));

let fileCheck = (filePath)=>{
    return new Promise((resolve,reject)=>{
        fs.access(filePath,fs.F_OK,err=>{
            if(err) reject(err);
            resolve(filePath);
        })
    })
}

let fileRead = (filePath)=>{
    return new Promise((resolve,reject)=>{
        fs.readFile(filePath,(err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

let start = (req,res)=>{
    let method = req.method;
    let param = url.parse(req.url,true);
    let filePath = __dirname + param.pathname;

    let ext = path.extname(filePath);

    fileCheck(filePath)
    .then(fileRead)
    .then(data=>{
        res.writeHead(200,{'Content-type':'text/html'});
        res.write(data);
    })
    .catch(err =>{
        res.writeHead(404,{'Content-type':'text/html'});
        res.end('404 page not found');
    });
}

// let dataStr = process.argv[2];
// let imgname = process.argv[3];
// let qrimg = qr.image(dataStr,{type : 'jpg',size : 20});      //to build qrCode
// qrimg.pipe(fs.createWriteStream(imgname));

let server = http.createServer(start);

server.listen(process.env.PORT,()=>{
    console.log(`Server is running at port ${process.env.PORT}`);
});