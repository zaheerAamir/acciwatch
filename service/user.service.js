import { callEmergencyRepo, checkUserExists, userRegisterRepo } from "../repository/user.repo.js";
import { generateUserId } from "../utils/helper.js";
import twilio from "twilio";
import "dotenv/config";

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

/**
  * @param {string} mcc 
  * @param {string} mnc 
  * @param {string} lac 
  * @param {string} cellid 
  * **/
export async function getLocService(mcc, mnc, lac, cellid) {

  try {

    const deciLAC = parseInt(lac, 16);
    const deciCellId = parseInt(cellid, 16);
    const token = process.env.UNWIRED_ACCESS_TOKEN;

    let response;


    if (token && token !== undefined) {
      response = await fetch('https://us1.unwiredlabs.com/v2/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          mcc: parseInt(mcc),
          mnc: parseInt(mnc),
          radio: "gsm",
          cells: [
            { lac: deciLAC, cid: deciCellId, psc: 0 }
          ],
          address: 1
        })
      });

    }
    const data = await response.json();

    const query = `
    [out:json];
    (
      node(around:500,${data.lat},${data.lon})["amenity"="hospital"];
    );
    out body;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: query
    });

    const data2 = await res.json();
    const hospital = data2.elements.map((el) => {
      return {
        name: el.tags?.name,
        lat: el.lat,
        lon: el.lon
      }
    })

    return hospital;




  } catch (err) {
    throw new Error(err);
  }


}
