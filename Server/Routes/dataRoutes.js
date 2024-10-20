const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {createData,getData,DeleteData}=require('../controllers/datacontroller'); 

routes.post('/data',createData);
routes.get('/data',getData);
routes.delete('/data',DeleteData);


module.exports=routes;