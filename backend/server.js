import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // to parse JSON data into req.body
app.use(express.urlencoded({ extended: true })); // to parse form data into req.body
app.use(cookieParser()); // to parse cookies from req.headers.cookie

// routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});