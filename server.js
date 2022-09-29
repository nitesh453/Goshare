const express = require('express');
var bodyParser = require('body-parser')
const connection = require('./config/db')
const path = require('path')
const app = express();
connection();
const PORT = process.env.PORT || 8000
//satic server know about css
app.use(express.static('public'))
//use json
app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//template engine
app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')
//Routes
app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));



//home page
app.get('/',(req,res)=>{
    res.render('home',{error: 'not render'})
})
app.listen(PORT,()=>{
    console.log(`server runing on port ${PORT}`);
})