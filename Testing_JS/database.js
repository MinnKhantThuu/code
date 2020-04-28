require('dotenv').config();
let client = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/ourdb';
let express = require('express');
let app = express();


let errorCheck = (err, res) => { if (err) console.log(err); else console.log(res) };


let makeCollection = (colleName) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.createCollection(colleName, (err, res) => errorCheck(err, res));
    });
}

let insertData = (obj) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').insertOne(obj, (err, res) => errorCheck(err, res));
    });
}

let insertDatas = (obj) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').insertMany(obj, (err, res) => errorCheck(err, res));
    });
}

let query = { name: 'Mg Mg' };

let findUser = (query) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').findOne(query, (err, res) => errorCheck(err, res));
    });
}

let findUserQuery = (query) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').find(query).toArray((err, res) => {
            errorCheck(err, res);
        });
    });
}


//find and result is asseding and desecending
let findUserName = (findUserQuery) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').find(query, { projection: { _id: 0, name: 1 } }).toArray((err, res) => {
            errorCheck(err, res)
        });
    });
}

let deleteData = (query) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').deleteOne(query, (err, res) => errorCheck(err, res));
    });
}

let deleteDatas = (query) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').deleteMany(query, (err, res) => errorCheck(err, res));
    });
}

let dropCollection = () => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.dropCollection('users', (err, res) => errorCheck(err, res));
    });
}

let updateOne = (query) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').updateOne(query, { $set: { email: 'koko@gmail.com' } }, (err, res) => errorCheck(err, res));
    })
}

app.listen(process.env.PORT, () => {
    console.log({ data: `Server is running at port ${process.env.PORT}` });
});