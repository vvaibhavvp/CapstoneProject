import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
    country_name: {
        type: String,
        required: true
    },
    country_code: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        uppercase: true, 
        minlength: 2, 
        maxlength: 2,
        match: /^[A-Z]{2}$/
    }
}, { timestamps: true });

const Country = mongoose.model('Country', CountrySchema);
export default Country;