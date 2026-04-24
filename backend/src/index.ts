import { createApp } from "./presentation/app";
import { env } from "./infrastructure/config/env";
import { logger } from "./infrastructure/config/logger";
import { sequelize } from "./infrastructure/database/sequelize";
import "./infrastructure/database/models";

async function bootstrap() {
  await sequelize.authenticate();
  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "Backend listening");
  });
}

bootstrap().catch((error) => {
  logger.error({ err: error }, "Failed to bootstrap backend");
  process.exit(1);
});
