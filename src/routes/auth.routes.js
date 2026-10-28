import express from "express";
import {createUser,login, updateUser} from "../controllers/auth.controller.js"
import {validateUser,validateAuth} from "../middleware/validarAuth.js";

const router = express.Router();

router.post("/registro",validateUser,createUser);
router.post("/login",validateAuth,login);
router.put("/actualizar/:id",validateUser,updateUser)

export default router;