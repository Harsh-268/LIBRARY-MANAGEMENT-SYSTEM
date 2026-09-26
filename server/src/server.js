import 'dotenv/config';
import app from './app.js';
import connectDB from './db/index.js';


connectDB()
.then(()=>{
    app.on("error",(Error)=>{console.log("Server error: ",Error)
        throw Error;
    })

    app.listen(process.env.PORT || 5001,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
        console.log(`http://localhost:${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed",error)
})