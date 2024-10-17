import { callEmergencyRepo, userRegisterRepo } from "../repository/user.repo.js";
import { generateUserId } from "../utils/helper.js";
import twilio from "twilio";
import { config } from "dotenv";

/**
  * @param {import("../schema/user.schema").User} body 
**/
export async function userRegisterService(body) {

  try {
    body.userID = generateUserId();
    userRegisterRepo(body);
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

      }
    }



  } catch (err) {
    throw new Error(err);
  }

}
