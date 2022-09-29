const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const File = require('../models/fileschema')
const {v4:uuid4} = require('uuid')

let storage = multer.diskStorage({
    destination: (req,file,cb)=> cb(null,'uploads/'),
    filename: (req,file,cb) =>{
        const uniquename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null,uniquename)
    } //18544325987254.jpg
})

let upload = multer({
    storage,
    limits: {fileSize:  2000 * 1024 * 1024}
}).single('myfile')
router.post('/',(req,res)=>{
    //validated request
    
    var id = uuid4();
    //store
      upload(req,res,async(err)=>{
        
        if(err){
            return res.status(500).send({error:err.message})
        }
    //store into database
     const file = new File({
        uuid: id,
        path:req.file.path,
        size:req.file.size
     })
        
     const response = await file.save();
    // return res.json({file: `${req.body.from} ${req.body.to} ${req.body.myfile}`})
    // return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`})
     //http://localhost:3000/files/2347jh874reu982jhd
     //send Link togmail

     const uvid = id;
     const reciverEmail = req.body.to;
     const senderEmail = req.body.from;
     if(!uvid || !reciverEmail || !senderEmail){
         return res.status(422).send({error: "all field are required"})
     }
 
     //get data form database
     const fi = await File.findOne({uuid: uvid});
     if(fi.sender){
         return res.status(422).send({error: 'file already send...'})
     }
     file.sender = senderEmail;
     file.receiver = reciverEmail;
     const res = await file.save();
 
     //ssend email
     const sendmail = require('../services/emailService');
 
     sendmail({
         from:senderEmail,
         to:reciverEmail,
         subject:'Gofile sharing...',
         text:`${senderEmail} shared file with you..`,
         html:  require('../services/emailTemplate')({
             emailFrom: senderEmail, 
             downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
             size: parseInt(file.size/1000) + ' KB',
             expires: '24 hours'
         })
     })
 
     
    })
    //response download link
   // return res.json({sucess: `file is send...`}) 
   return res.json({file: `${process.env.APP_BASE_URL}files/${id}`})
})
//get data from upload



//send email
 
//router.post('/send',async(req,res)=>{
    //validate request
    // console.log(req.body.uuid);
    // return res.send({})
    // const uvid = req.body.uuid;
    // const reciverEmail = req.body.reciverEmail;
    // const senderEmail = req.body.senderEmail;
    // if(!uvid || !reciverEmail || !senderEmail){
    //     return res.status(422).send({error: "all field are required"})
    // }

    // //get data form database
    // const file = await File.findOne({uuid: uvid});
    // if(file.sender){
    //     return res.status(422).send({error: 'file already send...'})
    // }
    // file.sender = senderEmail;
    // file.receiver = reciverEmail;
    // const response = await file.save();

    // //ssend email
    // const sendmail = require('../services/emailService');

    // sendmail({
    //     from:senderEmail,
    //     to:reciverEmail,
    //     subject:'Gofile sharing...',
    //     text:`${senderEmail} shared file with you..`,
    //     html:  require('../services/emailTemplate')({
    //         emailFrom: senderEmail, 
    //         downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email` ,
    //         size: parseInt(file.size/1000) + ' KB',
    //         expires: '24 hours'
    //     })
    // })

    //  return res.send({sucess:  true})


module.exports = router;