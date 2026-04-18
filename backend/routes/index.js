import { Router } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import cropsRouter from "./crops.js";
import contractsRouter from "./contracts.js";
import messagesRouter from "./messages.js";
import dashboardRouter from "./dashboard.js";
import uploadRouter from "./upload.js";

const router = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(cropsRouter);
router.use(contractsRouter);
router.use(messagesRouter);
router.use(dashboardRouter);
router.use(uploadRouter);

export default router;
