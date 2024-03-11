import express from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import bcrypt from "bcryptjs"
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async(req, res, next) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            //throw new Error("please fill all the inputs")
            return next(new ErrorHandler('please fill all the fields', 400))
        }
        //check if the user exisst
        const userExists = await User.findOne({email})
        if(userExists){
            res.status(400).json({message:"user already exists"});
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({name, email, password:hashPassword});

        await newUser.save();
        createToken(res, newUser._id);
        
        res.status(200).json({
            
            message:"we don do am ooo",
            newUser
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            message:'internal server error'
        })
    }
})

const loginUser = asyncHandler(async(req, res, next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return next(new ErrorHandler('please fill all the fields', 400))
        }

        //check my database
        const existingUser = await User.findOne({email})
        if(existingUser){
            const isPasswordValid = await bcrypt.compare(
                password,
                existingUser.password
            );
            if(!isPasswordValid){
                return next(new ErrorHandler('incorrect password', 400));
            }else{
                createToken(res, existingUser._id);

                res.status(200).json({
                    success:true,
                    existingUser,
                });
                return

            }
            
        }else{
            return next (new ErrorHandler('this email is not registered, kindly register', 400));
        }


    }catch(error){
        console.log(error.message)
        return next(new ErrorHandler('error loggin in', 500))
    }
})

const logout = asyncHandler(async(req, res, next) => {
    try{
        res.cookie('jwt', "", {
            httpOnly:true,
            expires:new Date(0),
        });
        res.status(200).json({
            message: 'user logged out successfully'
        })

    }catch(error){
        return next(new ErrorHandler(error.message, 500))
    }
});

const getAllUsers = asyncHandler(async(req, res, next) => {
    try{
        const users = await User.find({})
        res.json(users)

    }catch(error){
        return next(new ErrorHandler(error.message, 500))
    }
})



export {
    createUser,
    loginUser,
    logout,
    getAllUsers
}


