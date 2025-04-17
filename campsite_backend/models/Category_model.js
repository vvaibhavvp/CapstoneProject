import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name: {
        type: String,
        required: true
    },
    category_description: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;