import express from "express";
import { callEmergencyController, healthCheckController, userRegisterController } from "../controller/user.controller.js";

/**
  * @param {express.Express} app 
**/
function routes(app) {
  app.get("/api/v1/healthCheck", healthCheckController);
  app.post("/api/v1/userRegister", userRegisterController);
  app.post("/api/v1/callEmergency", callEmergencyController)
}

export default routes;
