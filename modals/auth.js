import mongoose from "mongoose";


const authSchema = mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    phone: { type: Number, required: true, },
    password: { type: String, required: true, },
    name: { type: String, required: true },
    token:{type:String}

}, {
    timeStamps: true
})

const UserAuth = mongoose.model('User', authSchema);

export default UserAuth;