const mongoose = require("mongoose");

const url = "mongodb+srv://admin:dDBMnnMYHlzQMn3M@cluster0.njey3.mongodb.net/neurolingua?retryWrites=true&w=majority"
const options= {
    sslValidate:true,
    // useNewUrlParse:true,
    dbName:"neurolingua",
    useUnifiedTopology:true,
    //  useCreateIndex: true,
}

mongoose.connect(url,options);
const connection= mongoose.connection;

connection.on('error',(err)=>{
    console.error.bind(console,"Database connection error");
    connection.close();
})

connection.once('connected',()=>{
    console.log("Database connected successfully")
})

module.exports.db=connection