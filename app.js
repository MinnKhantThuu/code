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

let insertOrder = (obj) => {
    client.connect(url, { useNewUrlParser: true }, (err, inst) => {
        if (err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').findOne({}, (err, res) => {
            if (err) throw err;
            obj.forEach(data => {
                data['userId'] = res._id;
                dbo.collection('orders').insertOne(data, (err, res) => errorCheck(err, res));
            });
        });
    });
}

// insertOrder([
//     { userId: 'userid', name: 'Seoul Myanmar', price: 4500, count: 3, level: 7 },
//     { userId: 'userid', name: 'Mala Xian Guo', price: 10000, count: 1, level: 'medium' },
//     { userId: 'userid', name: 'Bon Chon', price: 2500, count: 9, level: null },
// ]);

let joinTable = ()=>{
    client.connect(url,{useNewUrlParser:true},(err,inst)=>{
        if(err) throw err;
        let dbo = inst.db('ourdb');
        dbo.collection('users').aggregate([
            {
                $lookup :{
                    from:'orders',
                    localField:'_id',
                    foreignField:'userId',
                    as:'user_orders'
                }
            }
        ]).toArray((err,res)=>errorCheck(err,res));
    })
}

joinTable();

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