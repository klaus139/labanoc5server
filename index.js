import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/database.js";
import { ErrorMiddleWare } from "./middleware/Error.js";
dotenv.config();

const app = express();

//database

connectDB();

const port = 5050;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//routes
app.use('/api/users', userRoutes);

//error routes
app.all('*', (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 400;
    next(err);
})

app.use(ErrorMiddleWare);


app.listen(port, ()=> console.log(`server is running on port ${port}`));
