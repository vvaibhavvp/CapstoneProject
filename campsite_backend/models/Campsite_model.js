import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CampsiteSchema = new Schema({
    campsite_name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true,
    },
    country_id: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    amount: {
        type: mongoose.Decimal128,
        required: true,
        validate: {
            validator: function(value) {
                return value > 0;
            },
            message: "Amount must be greater than 0."
        }
    },
    amenities: [{
        type: String
    }],
    image: {
        type: [String],
        required: true
    },
    availability: {
        type: String,
        enum: ['Available', 'Fully Booked', 'Seasonal'],
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required : true
    },
    tags: [{
        type: String,
        enum: ['Pet-Friendly', 'Mountain-View', 'Lake-Side', 'Family-Friendly', 'Romantic']
    }],
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return this.start_date < value;
            },
            message: "End date must be after start date."
        }
    },
    // average_rating: {
    //     type: mongoose.Decimal128,
    //     default: 0
    // },    
    created_at: {
        type: Date,
        default: Date.now,
    }
});

//  Use ES6 export
export const Campsite = mongoose.model("Campsite", CampsiteSchema);
