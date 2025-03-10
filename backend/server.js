import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth from "./routes/auth.js";
import User from "./routes/user.js";
import session from "./routes/session.js"
import cart from "./routes/cartItem.js";

dotenv.config();

const app = express();

// CORS setup
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());

console.log("MONGODB_URI:", process.env.MONGODB_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));


app.use('/api/auth', auth);
app.use('/api/session', session);
app.use('/', User);
app.post('/', cart);

import loyaltyRoutes from "./routes/loyalty.js";
app.use("/api/loyalty", loyaltyRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
