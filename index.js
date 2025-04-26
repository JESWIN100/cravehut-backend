import express from "express";
import { connectDb } from "./config/databse.js";
import v1Router from "./routes/index.js";
import cookieParser from 'cookie-parser';
import logger from 'morgan'
import cors from 'cors'




const app= express()

app.use(cors({
  origin: process.env.CORS, // fallback for local testing
  credentials: true
}));


app.use(logger('dev'));
app.use(express.json())
app.use(cookieParser());


connectDb()
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use('/api/v1',v1Router)

app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT || 3036} 💻`)
})