import { callEmergencyRepo, checkUserExists, userRegisterRepo } from "../repository/user.repo.js";
import { generateUserId } from "../utils/helper.js";
import twilio from "twilio";
import { config } from "dotenv";

let details = {}

/**
  * @param {import("../schema/user.schema").User} body 
**/
export async function userRegisterService(body) {

  try {
    body.userID = generateUserId();
    const resp = await checkUserExists(body.email);

    if (resp) {
      console.log("User Does not exist!")
      userRegisterRepo(body);
    } else {

      return "User already exist";
    }

  } catch (err) {
    throw new Error(err);
  }

}

/**
  * @param {number[]} phoneNumbers 
**/
export async function verifyEmergencyContact(phoneNumbers) {

  /**
    * @type {Object[]}
  **/
  const resp = [];

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  let client;

  if (accountSid !== undefined && authToken !== undefined) {

    client = twilio(accountSid, authToken);
  }

  for (const phoneNumber of phoneNumbers) {
    try {
      const numberInfo = await client.lookups.v1.phoneNumbers(phoneNumber).fetch({ countryCode: "IN" });
      console.log(numberInfo);
      resp.push(numberInfo);

    } catch (err) {
      throw new Error(err)

    }

  }
  return resp;

}

/**
  * @param {import("../schema/user.schema").AccidentDetails} body 
**/
export async function callEmergencyService(body) {

  try {
    const user = await callEmergencyRepo(body);
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioNumber = process.env.TWILIO_NUMBER;
    const phoneNumbers = [user[0].emergencyContact1, user[0].emergencyContact2];

    let client;
    if (accountSid !== undefined && authToken !== undefined) {
      client = twilio(accountSid, authToken);
    }

    if (twilioNumber !== undefined) {
      for (const phoneNumber of phoneNumbers) {

        const call = await client.calls.create({
          from: twilioNumber,
          to: `+91${phoneNumber}`,
          url: "http://demo.twilio.com/docs/voice.xml",
        })
        console.log(call.sid);


        const message = await client.messages.create({
          body: "Hi this message is from Aamir",
          from: twilioNumber,
          to: `+91${phoneNumber}`,
        })
        console.log(message.sid);
      }
    }
    */

    await getAccidentDetailsService(user, body);
    details = {
      user,
      body
    }
    return true;



  } catch (err) {
    throw new Error(err);
  }

}

/**
  * @param {import("../schema/user.schema").AccidentDetails} AccidentDetails 
  * @param {import("../schema/user.schema").User} user 
  * **/
export async function getAccidentDetailsService(user, AccidentDetails) {

  try {

    return { details };
  } catch (err) {
    throw new Error(err);
  }

}
