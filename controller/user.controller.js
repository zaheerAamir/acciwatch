import express, { json } from "express";
import { callEmergencyService, getAccidentDetailsService, userRegisterService, verifyEmergencyContact } from "../service/user.service.js";
import { PluginListInstance } from "twilio/lib/rest/flexApi/v1/plugin.js";

/**
  * @param {express.Request} req 
  * @param {express.Response} res 
**/
export async function healthCheckController(req, res) {

  res.status(200).json("Server is healthy!! 🦾")
}

/**
  * @param {express.Request} req 
  * @param {express.Response} res 
**/
export async function userRegisterController(req, res) {

  try {
    /**
      * @type {import("../schema/user.schema").User}
    **/
    const body = req.body;
    if (!body.name || typeof body.name !== 'string') {
      res.status(400).json({ message: "Invalid user Name. User name should of type String!" });
      return;
    }
    if (!body.email || typeof body.email !== 'string') {
      res.status(400).json({ message: "Invalid Email! Email should of type string!" });
      return;
    }
    if (!body.phoneNo || typeof body.phoneNo !== 'number') {
      res.status(400).json({ message: "Invalid Phone number! Phone number should of type number!" });
      return;
    }
    if (body.phoneNo.toString().length !== 10) {
      res.status(400).json({ message: "Invalid Phone number! Phone number should of length 10!" });
      return;
    }
    if (!body.vehicleName || typeof body.vehicleName !== 'string') {
      res.status(400).json({ message: "Invalid vehicleName! vehicleName should of type string!" });
      return;
    }
    if (!body.vehicleNumber || typeof body.vehicleNumber !== 'string') {
      res.status(400).json({ message: "Invalid vehicleNumber! vehicleNumber should of type string!" });
      return;
    }
    if (!body.emergencyContact1 || typeof body.emergencyContact1 !== 'number') {
      res.status(400).json({ message: "Invalid emergencyContact1! emergencyContact1 should of type number!" });
      return;
    }
    if (!body.emergencyContact2 || typeof body.emergencyContact2 !== 'number') {
      res.status(400).json({ message: "Invalid emergencyContact2! emergencyContact2 should of type number!" });
      return;
    }

    if (body.emergencyContact1.toString().length !== 10 || body.emergencyContact2.toString().length !== 10) {
      res.status(400).json({ message: "Invalid emergencyContacts! number should be of length 10" });
      return;
    }

    if (body.phoneNo === body.emergencyContact1 || body.phoneNo === body.emergencyContact2) {
      res.status(400).json({ message: "Users phone number should not be in emergencyContacts!" });
      return;
    }
    const resp = await verifyEmergencyContact([body.emergencyContact1, body.emergencyContact2]);
    if (!resp) {
      res.status(500).json({ message: "Internal Server error!" })
    }
    const checkUser = await userRegisterService(body);
    if (checkUser === undefined) {
      res.status(201).json({ message: "User Registered Successfully!!" });
      return;
    } else {
      res.status(400).json({ message: "User already exists!" });
      return;
    }

  } catch (err) {
    console.log(err.message);
    res.status(400).json({ message: err.message });
    return;
  }

}

/**
  * @param {express.Request} req 
  * @param {express.Response} res 
**/
export async function callEmergencyController(req, res) {

  try {
    /**
      * @type {import("../schema/user.schema").AccidentDetails}
    **/
    const body = JSON.parse(req.body);

    if (!body.userID || typeof body.userID !== 'string') {
      return res.status(400).json({ message: "Invalid UserID! UserID must be of type String." });
    }

    if (!body.accidentDetails || typeof body.accidentDetails !== 'string') {
      return res.status(400).json({ message: "Invalid accidentDetails! accidentDetails must be of type String." });
    }
    const result = await callEmergencyService(body);
    if (result) {
      return res.status(204);
    }


  } catch (err) {
    res.status(400).json({ message: err.message });
    return;
  }

}

/**
  * @param {express.Request} req 
  * @param {express.Response} res 
**/
export async function getAccidentDetailsController(req, res) {

  try {

    const result = await getAccidentDetailsService();
    return res.status(200).json(result);

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

}
