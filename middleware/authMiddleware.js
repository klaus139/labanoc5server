import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from './asyncHandler.js';

const authenticate = asyncHandler(async (req, res, next) => {
    let token;

    // Use req.cookies.jwt instead of res.cookies.jwt
    token = req.cookies.jwt;
    

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            throw new Error('Not authorized, token failed');
        }
    } else {
        throw new Error('No token provided, please login');
    }
});


const authorizeAdmin = asyncHandler(async(req, res, next) => {
    try{
        if(req.user && req.user.isAdmin){
            next();
        }else{
            res.status(401).send('not authorized to access this route')
        }

    }catch(error){
        console.log(error.message)
    }
})

export {authenticate, authorizeAdmin};