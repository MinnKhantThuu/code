require('dotenv').config();
let express = require('express'),
    app = express(),
    multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './assets/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage: storage })

app.post('/upload', upload.single('image'), function (req, res, next) {
    console.log(req);
});

app.post('/multiupload', upload.array('images',12), function (req, res, next) {
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port ${process.env.PORT}`);
});