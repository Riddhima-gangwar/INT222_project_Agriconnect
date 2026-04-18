import { Router } from "express";
import ImageKit from "imagekit";
import { requireAuth } from "../services/auth.js";

const router = Router();

router.get("/upload/auth", requireAuth, async (_req, res) => {
  try {
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error("ImageKit env vars missing:", { publicKey: !!publicKey, privateKey: !!privateKey, urlEndpoint: !!urlEndpoint });
      res.status(500).json({ error: "ImageKit is not configured on the server." });
      return;
    }

    const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });
    const authParams = imagekit.getAuthenticationParameters();

    res.json({
      ...authParams,
      publicKey,
    });
  } catch (err) {
    console.error("ImageKit auth error:", err);
    res.status(500).json({ error: "Failed to generate upload credentials." });
  }
});

export default router;
