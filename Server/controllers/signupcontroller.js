const Signup = require('../models/singup');



//post
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



//get


exports.getSignup = async (req, res) => {
    try {
        const signup = await Signup.find();
        console.log(signup);  // يظهر البيانات في التيرمينال (في السيرفر)
        res.json(signup);  // يرسل البيانات إلى المتصفح (العميل)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
