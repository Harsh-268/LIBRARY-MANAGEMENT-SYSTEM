import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();
app.use(cors({ origin:"http://localhost:5173", credentials: true }));
app.use(express.json({limit:"1mb"}))
app.use(express.urlencoded({ extended: true,limit:"16kb" }))
app.use(cookieParser());

//importing routes
import userRoute from './routes/user.routes.js';
import bookRoute from './routes/book.routes.js';
import issueRoute from './routes/issue.routes.js';
import dashboardRoute from './routes/dashboard.routes.js';
// Mounting routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1/books', bookRoute);
app.use('/api/v1/issues', issueRoute);
app.use('/api/v1/dashboard', dashboardRoute);
export default app;