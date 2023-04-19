const express= require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
// init db



// init router
app.get('/', (req,res,next)=>{
    const strCompress='Hello Vietnamese'
    return res.status(200).json({
        message:"Welcome Vietnamese",
        metadata:strCompress.repeat(10000)
    })
})
// handling error


module.exports= app;