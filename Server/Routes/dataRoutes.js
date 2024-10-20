const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {createData,getData}=require('../controllers/datacontroller'); 

routes.post('/data',createData);
routes.get('/data',getData);


module.exports=routes;