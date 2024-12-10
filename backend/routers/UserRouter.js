import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

import data from "../data.js";
import { generateToken } from "../utils.js";

const userRouter = express.Router();

userRouter.get('/seed', expressAsyncHandler(async (req, res) => {
    await User.deleteMany({});
    const createUser = await User.insertMany(data.users);

    res.send({ createUser });
}));

userRouter.post('/signin', expressAsyncHandler(async(req, res) => {
    console.log(req.body);
    
    const user = await User.findOne({ email: req.body.email });

    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.send({
                _id: user._id ,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user)
            });
            return;
        }
    }else{
        res.status(404).send({message:'Invalid email or password'});
    }
}));

export default userRouter;