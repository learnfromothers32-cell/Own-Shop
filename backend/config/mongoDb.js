import mongoose from "mongoose";

const connectDb = async ()=> {
mongoose.connection.on('connected',()=>{
    console.log('DB Connected Successfully')
})

    await mongoose.connect(`${process.env.MongoDB_URL}/E-commerce`)
}

export default connectDb;

