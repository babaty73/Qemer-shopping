import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function start() {
  await connectDB();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Kemer Market API running on port ${env.port} [${env.nodeEnv}]`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});
