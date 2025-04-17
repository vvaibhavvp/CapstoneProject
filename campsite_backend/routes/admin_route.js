import express from "express";
import {
  addCountry,
  getCountries,
  updateCategory,
  deleteCategory,
  updateCountry,
  deleteCountry,
  addCategory,
  getCategories,
  addCampsite,
  updateCampsite,
  deleteCampsite,
  getAllBookings
} from "../controller/admin_controller.js";
import { getAllCampsites } from "../controller/campsite_controller.js";
import { getAllSubscriptions } from "../controller/subscriptionController.js";

const router = express.Router();

router.post("/country", addCountry);
router.get("/country", getCountries);
router.put("/country/:countryId", updateCountry);
router.delete("/country/:countryId", deleteCountry);

// router.post('/state', addState);
// // router.get('/state', getStates);
// router.get('/state/:countryId', getStates);

router.post("/category", addCategory);
router.get("/category", getCategories);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

router.post("/campsite", addCampsite);
router.put("/editcampsite/:id", updateCampsite);
router.delete("/removecampsite/:id", deleteCampsite);
router.get("/campsite", getAllCampsites);
router.get('/bookings', getAllBookings);
router.get("/subscriptions", getAllSubscriptions);

export default router;
