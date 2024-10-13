import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: String, required: true },
    reciever:{type:String,required:true},
    timeStamp: { type: String, required: true }
})

const UserChats = mongoose.model('messages', messageSchema);
export default UserChats