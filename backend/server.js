import "dotenv/config";
import app from "./app.js";
import { logger } from "./services/logger.js";

// Trigger restart - logger fix for upload
const rawPort = process.env["PORT"];
const port = rawPort ? Number(rawPort) : 3000;

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
