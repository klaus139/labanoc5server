import express from "express";
import { createUser, getAllUsers, loginUser, logout } from "../controller/userController.js";
import { authenticate, authorizeAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser)
router.get('/logout', logout);

//get all users
router.get('/all-users', authenticate, authorizeAdmin, getAllUsers);



export default router;