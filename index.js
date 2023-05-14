var express = require('express');
var cors = require('cors');

const path = require("path");

require('dotenv').config();

const multer = require("multer");

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



const storageEngine = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});





const checkFileType = function(file, cb) {
  //Allowed file extensions
  const fileTypes = /\*/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

//initializing multer
const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 10000000 },
  // fileFilter: (req, file, cb) => {
  //   checkFileType(file, cb);
  // },
});


app.post("/api/fileanalyse", upload.single('upfile'), (req, res) => {
  if (req.file) {
    res.json({ name: req.file.originalname, type: req.file.mimetype, size: req.file.size });
  } else {
    res.status(400).send("Please upload a valid image");
  }
});



const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Your app is listening on port ' + port)
});
