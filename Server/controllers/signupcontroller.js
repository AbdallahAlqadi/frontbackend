const Signup = require('../models/singup');


exports.createSignup = async (req, res) => {
    const { name, email, password ,confpassword} = req.body;

    try {
        const newSignup = {  name, email, password ,confpassword};
        console.log(newSignup);
        
        const dbSignup = await Signup.create(newSignup);
        
        res.status(200).json({ message: `User created successfully: ${dbSignup}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
