import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Required for ES Modules

// Import Routes
import userRoute from "./routes/user_route.js";
import AdminRoute from "./routes/admin_route.js";
import campsiteRoute from "./routes/campsite_route.js";
import bookingRoute from "./routes/booking_route.js"; 
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import cartRoutes from "./routes/cart_routes.js";  
import paymentRoutes from "./routes/payment_route.js";


dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "public", "images")));
console.log(" Serving static files from:", path.join(__dirname, "public", "images"));

app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const URI = process.env.ATLAS_URI;

mongoose
  .connect(URI)
  .then(() => console.log(" Successfully connected to MongoDB"))
  .catch((error) => console.error("MongoDB Connection Error:", error));

// API Routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/user", userRoute);
app.use("/admin", AdminRoute);
app.use("/campsite", campsiteRoute);
app.use("/booking", bookingRoute); 
app.use("/user/subscriptions", subscriptionRoutes);
app.use("/cart", cartRoutes);  
app.use("/payment", paymentRoutes);


app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
