import express from "express";
import routes from "./src/routes.js";
import connectDb from "./utils/db.js";
import cors from "cors";

const PORT = 8080;
const app = express();

//app.use(cors({ origin: 'http://localhost:5173' }))
app.use(cors({ origin: '*' }))

app.listen(PORT, () => {
  connectDb();
  routes(app)
  console.log(`Server is running on Port ${PORT}`)
})
