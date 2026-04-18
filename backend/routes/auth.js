import { Router } from "express";
import { requireAuth } from "../services/auth.js";
import { register, login, logout, getMe, updateProfile } from "../controllers/authController.js";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", requireAuth, getMe);
router.put("/auth/profile", requireAuth, updateProfile);

export default router;
