import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/dbconfig.js';
import authRoutes from './routes/auth.routes.js';
import issueRoutes from './routes/issue.routes.js';


dotenv.config()
connectDB()




const app = express()
app.use(cors({
    origin: ['http://localhost:19006', 'http://localhost:8081', 'http://localhost:3000', 'http://192.168.8.123:3000', 'http://192.168.8.123:8081'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use('/api/auth/', authRoutes)

app.use("/api/issues/", issueRoutes);


app.listen(3000, () => {
    console.log("server Started")
})