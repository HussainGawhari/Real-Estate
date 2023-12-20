export const signup = async(req, res)=> {
   const {username, email, password} = req.body;
   const hashpassword = bcrypt.hashsync(password,10);

    const newUser = new User(username, email, hashpassword);
    try{
       await newUser.save();
        res.status(2001).json("User created successfully");
    }catch(err){
        res.status(500).json(err.message);
    }



};
