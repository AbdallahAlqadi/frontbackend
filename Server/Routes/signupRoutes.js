const express=require('express')
const cors=require('cors');
const routes=express.Router();
require('dotenv').config();

const {createSignup}=require('../controllers/signupcontroller'); 
routes.post('/signup',createSignup);



module.exports=routes;