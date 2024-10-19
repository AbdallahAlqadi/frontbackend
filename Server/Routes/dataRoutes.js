const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {createData}=require('../controllers/datacontroller'); 

routes.post('/data',createData);


module.exports=routes;