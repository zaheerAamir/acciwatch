import mongoose from "mongoose";

/**
  * @typedef {Object} User
  * @property {String} userID - User's ID
  * @property {String} name - User's Name
  * @property {String} email - User's Email
  * @property {number} phoneNo - User's Phone Number
  * @property {String} vehicleNumber - User's Number Plate 
  * @property {String} vehicleName - User's Vehicle Name
  * @property {Number} emergencyContact1
  * @property {Number} emergencyContact2
**/

/**
  * @type {mongoose.Schema<User>}
**/
const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, // Match validator for Gmail addresses,
  },
  phoneNo: {
    type: Number,
    required: true,
    unique: true,
  },
  vehicleName: {
    type: String,
    required: true,
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  emergencyContact1: {
    type: Number,
    required: true,
    unique: true,
  },
  emergencyContact2: {
    type: Number,
    required: true,
    unique: true,
  }

})

/**
  * @type {mongoose.Model<User>}
**/
export const userModel = new mongoose.model("User", userSchema, "users");


/**
  * @typedef {Object} AccidentDetails
  * @property {String} userID
  * @property {String} accidentDetails
**/
