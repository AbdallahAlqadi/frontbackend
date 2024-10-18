const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {createSignup,getSignup}=require('../controllers/signupcontroller'); 
routes.post('/signup',createSignup);

routes.get('/signup',getSignup);


module.exports=routes;