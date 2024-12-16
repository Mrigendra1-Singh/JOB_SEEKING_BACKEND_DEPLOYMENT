import  express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import jobRouter from "./routes/jobRouter.js";
import { dbConnection } from "./database/dbConnection.js"; 
import { errorMiddleware } from "./middlewares/error.js";

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url); // Get the file's full path
const __dirname = path.dirname(__filename);  

const app = express();
dotenv.config({path: "./config/config.env"});

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods: ['GET','POST','DELETE','PUT'],
    credentials:true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const tempDir = path.join(__dirname, 'tmp/');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true }); // Create the directory if it doesn't exist
}

// File upload middleware
app.use(fileUpload({
    useTempFiles: true,      // Enable temporary file storage
    tempFileDir: tempDir,    // Use the ensured temp directory
}));

// app.use(fileUpload({
//     useTempFiles:true,
//     tempFileDir:"/temp/",
// }));

app.use("/api/v1/user",userRouter);
app.use("/api/v1/application",applicationRouter);
app.use("/api/v1/job",jobRouter);

dbConnection();

app.use(errorMiddleware);


export default app;