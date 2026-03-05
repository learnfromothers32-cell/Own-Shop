import mongoose from "mongoose";

const connectDb = async () => {

  mongoose.connection.on('connected', () => {
    console.log('DB Connected Successfully')
  });

  await mongoose.connect(`${process.env.MONGODB_URI}/E-commerce`);

}

export default connectDb;