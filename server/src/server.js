import mongoose from 'mongoose';
import app from './app.js';
import { config, loadEnvironment } from './config/env.js';

async function startServer() {
  loadEnvironment();
  await mongoose.connect(config.mongoUri);
  app.listen(config.port, () => {
    console.log(`LearnSphere API listening on http://localhost:${config.port}`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start LearnSphere API:', error.message);
  process.exitCode = 1;
});
