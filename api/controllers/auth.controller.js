import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import {errorHandler}  from '../utils/error.js';
import jwt from 'jsonwebtoken';
export const signup = async(req, res, next)=> {
   const {username, email, password} = req.body;
   const hashpassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({username, email, password: hashpassword});
    let data;
    
    try{
       data = await newUser.save();
        res.status(200).json("User created successfully");
       
    }catch(error){
        next(error);
    }

    // console.log("data from api",data)
};

export const signin = async(req, res,next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({email});
        if (!validUser) return next(errorHandler(404, "User not found! "));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(404, " wrong credentials!"));
        const token = jwt.sign({id: validUser._id}, process.env.SECRET_KEY)
        const {password: pass, ...rest} = validUser._doc;
        res.cookie('acess_token', token, {hhtponly: true})
        .status(200)
        .json(rest);

    }catch(error){
        next(error);
    }
}
