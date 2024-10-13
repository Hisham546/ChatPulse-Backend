import mongoose from "mongoose";


const authSchema = mongoose.Schema({

    phone: { type: Number, required: true, },
    password: { type: String, required: true, },
    name: { type: String, required: true },

}, {
    timeStamps: true
})

const UserAuth = mongoose.model('User', authSchema);

export default UserAuth;