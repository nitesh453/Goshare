const router = require('express').Router();
const File = require('../models/fileschema')
// : meaning is yaha e parameter hai
router.get('/:uuid',async(req,res)=>{
    try{
        const file = await File.findOne({uuid: req.params.uuid})
        if(!file){
            return res.render('download',{error: 'link has been expire...'});
        }
        return res.render('download',{
            uuid:file.uuid,
            filename:file.filename,
            fileSize:file.size,
            downloadLink: `/files/download/${file.uuid}`
            //https://localhost:3000//files/download/jfjhskjg834jkfh923rijkeu
        })
    } catch(err){
        return res.render('download',{error: 'something went wrong'});
    }
})






module.exports = router