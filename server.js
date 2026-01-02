const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

/* =========================
   IMPORTANT: Disable buffering
========================= */
mongoose.set('bufferCommands', false);

/* =========================
   Import routes
========================= */
const heroRoutes = require('./routes/hero');
const experiencesRoutes = require('./routes/experiences');
const technologiesRoutes = require('./routes/technologies');
const projectsRoutes = require('./routes/projects');
const achievementsRoutes = require('./routes/achievements');
const contactRoutes = require('./routes/contact');

const app = express();


app.use(helmet());
app.use(compression());


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected');
  } catch (err) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }

  return cached.conn;
};


app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});


app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio Backend API',
    status: 'Running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/hero', heroRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use('/api/technologies', technologiesRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/contact', contactRoutes);


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


module.exports = app;
