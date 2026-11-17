import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { config } from './config/env.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const app = express();

app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/api/health', (_request, response) => {
  response.json({ success: true, message: 'LearnSphere API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/settings', settingsRoutes);

app.use((_request, response) => {
  response.status(404).json({ success: false, message: 'Route not found' });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  if (error.name === 'ValidationError') {
    const errors = Object.fromEntries(Object.entries(error.errors).map(([field, detail]) => [field, { message: detail.message }]));
    return response.status(400).json({ success: false, message: Object.values(errors).map((detail) => detail.message).join(' '), errors });
  }
  if (error.code === 11000) {
    return response.status(409).json({ success: false, message: 'A record with that value already exists' });
  }
  if (error.name === 'CastError') {
    return response.status(400).json({ success: false, message: 'Invalid resource identifier' });
  }
  if (error.name === 'MulterError' || error.message === 'Unsupported file type') {
    return response.status(400).json({ success: false, message: error.message });
  }
  return response.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;
