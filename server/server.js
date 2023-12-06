import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import path from "path";
import { errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const config = dotenv.config();
import itemRouter from './routes/ItemRoutes.js';
import userRouter from './routes/UserRoutes.js';
import transactionRouter from './routes/TransactionRoutes.js';
import storageRouter from './routes/StorageRoutes.js';
import orderRouter from './routes/OrderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.use('/api/name', name); use the route
app.use("/api/item", itemRouter);
app.use("/api/user", userRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/storage", storageRouter);
app.use("/api/order", orderRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
  })
}

app.use(errorHandler);