import express from "express";
import routes from "./src/routes.js";
import connectDb from "./utils/db.js";

const PORT = 8080;
const app = express();
app.use(express.json())

app.listen(PORT, () => {
  connectDb();
  routes(app)
  console.log(`Server is running on Port ${PORT}`)
})
