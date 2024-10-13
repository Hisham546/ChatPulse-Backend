
import UserChats from "../modals/message.js";


export async function saveChats (message){


    const newMessage = new UserChats({
        message: message.message,
        sender: message.sender,
        reciever:message.reciever,
        timeStamp: message.timeStamp

    });

    try{
        await newMessage.save();

    }catch(error){

    }
};

export async function getAllTexts(req, res) {
    try {
        const chats = await UserChats.find({})
        
        res.status(200).json({
            success: true,
            data: chats,
        })
    } catch (error) {

    }
};