import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.connection.js';
import globalErrorHandler from './middlewares/globalErrorHandler.middleware.js';

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: [process.env.CORS_ORIGIN, "http://localhost:4173"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Import Routes
import adminRoutes from './routers/admin.routes.js';
import messageRoutes from './routers/message.routes.js';
import portfolioRoutes from './routers/portfolio.routes.js';
import cloudinaryRoutes from './routers/cloudinary.routes.js';
import projectTypeRoutes from './routers/projectType.routes.js';
import contactDetailsRoutes from './routers/contactDetails.routes.js';

// Routers Declaration
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/portfolio', portfolioRoutes);
app.use('/api/v1/cloudinary', cloudinaryRoutes);
app.use('/api/v1/project-type', projectTypeRoutes);
app.use('/api/v1/contact-details', contactDetailsRoutes);

// Basic route
app.get('/', (_, res) => {
    res.send('API Server is running...');
});

// Global Error handling middleware
app.use(globalErrorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});