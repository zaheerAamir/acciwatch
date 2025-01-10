import express from "express";
import { callEmergencyController, getAccidentDetailsController, healthCheckController, userRegisterController } from "../controller/user.controller.js";

/**
  * @param {express.Express} app 
**/
function routes(app) {
  app.get("/api/v1/healthCheck", healthCheckController);
  app.post("/api/v1/userRegister", express.json(), userRegisterController);
  app.post("/api/v1/callEmergency", express.text(), callEmergencyController)
  app.get("/api/v1/getAccidentDetails", getAccidentDetailsController);
}

export default routes;
