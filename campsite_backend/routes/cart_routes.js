import express from "express";
import {
  addToCart,
  checkAvailability,
  updateCartItem,
  updateGuestCount,
  getCartItems,
  removeFromCart,
  checkout,
  clearCart,
} from "../controller/cart_controller.js";

const router = express.Router();

router.post("/checkAvailability", checkAvailability);
router.post("/add", addToCart);
router.put("/:id", updateCartItem);
router.put("/updateGuestCount/:id", updateGuestCount);
router.get("/:userId", getCartItems);
router.delete("/:id", removeFromCart);
router.post("/checkout", checkout);

// New route to clear cart after successful payment
router.delete("/clear/:userId", clearCart);

export default router;
