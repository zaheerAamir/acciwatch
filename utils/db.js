import mongoose from "mongoose";
import "dotenv/config";


async function connectDb() {

  try {

    const uri = process.env.URI;
    if (uri !== undefined) {
      await mongoose.connect(uri)
    }

  } catch (err) {
    throw new Error(err);
  }

}

export default connectDb;
