import { Campsite } from "../models/Campsite_model.js"; 

export const getAllCampsites = async (req, res) => {
    try {
        const campsites = await Campsite.find();
        res.status(200).json(campsites);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getCampsiteById = async (req, res) => {
    try {
        const campsite = await Campsite.findById(req.params.id).populate({
            path: 'country_id', 
            select: 'country_name'
        }).exec();
        if (!campsite) return res.status(404).json({ message: "Campsite not found" });
        
        // Ensure amenities are split by period and return them
        if (campsite.amenities) {
            campsite.amenities = campsite.amenities.map(amenity => amenity.split('.').map(sentence => sentence.trim()).filter(sentence => sentence.length > 0));
        }
        
        res.status(200).json(campsite);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
