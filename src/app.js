import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.get("/",(req,res)=>{
  res.json({
    mensaje:"API funcionando"
  });
});

app.use("/api",router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("Servidor ejecutandose en http://localhost:"+PORT);
});