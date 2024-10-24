import mongoose from "mongoose";


const activeSchema = mongoose.Schema({

    userId: { type: String, required: true, },


}, {

})

const UserActive = mongoose.model('ActiveStatus', activeSchema);

export default UserActive;