import express from "express";
import cors from "cors";
import dungeonRoutes from './routes/dungeon.js';

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  // possing the control
  next();
});



app.use((req, res, next) => {
  // logger
  console.log(`${req.method} request received at ${req.url}`);
  next();
})

app.use("/api", dungeonRoutes);

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
