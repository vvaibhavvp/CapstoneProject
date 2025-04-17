import express from "express";
import {getAllCampsites, getCampsiteById} from "../controller/campsite_controller.js";

const router = express.Router();

router.get("/campsitelist", getAllCampsites);
router.get("/campsiteDetails/:id", getCampsiteById);


export default router;