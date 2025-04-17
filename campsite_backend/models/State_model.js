import mongoose from "mongoose";
const Schema = mongoose.Schema;

const StateSchema = new Schema({
    state_name: {
        type: String,
        required: true
    },
    country_id: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    }
});

const State = mongoose.model('State', StateSchema);
export default State;