import { userModel } from "../schema/user.schema.js";

/**
  * @param {import("../schema/user.schema").User} body 
**/
export async function userRegisterRepo(body) {

  try {

    const newUser = new userModel(body);
    newUser.save();

  } catch (err) {
    throw new Error(err);
  }

}

/**
  * @param {String} email 
  * **/
export async function checkUserExists(email) {

  try {

    /**
      * @type {import("../schema/user.schema.js").User[]}
      * **/

    const user = await userModel.find({ email: email });
    console.log(user)
    if (!user || user.length === 0) {
      return true;
    }

    return false;

  } catch (err) {
    throw new Error(err);
  }


}

/**
  * @param {import("../schema/user.schema.js").AccidentDetails} body 
**/
export async function callEmergencyRepo(body) {

  try {
    /**
      * @type {import("../schema/user.schema.js").User}
    **/
    const user = await userModel.findOne({ userID: body.userID });
    if (!user || user === null || user === undefined) {
      throw new Error("UserID not found! User does not exist!");
    }
    return user;

  } catch (err) {
    throw new Error(err);
  }

}
