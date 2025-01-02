
import UserChats from "../modals/message.js";

import UserActive from "../modals/activeStatus.js"
import { v4 as uuidv4 } from 'uuid';
export async function saveChats(message) {
    //const chatId = uuidv4();

    const newMessage = new UserChats({
        textId: message.textId,
        message: message.message,
        sender: message.sender,
        reciever: message.reciever,
        timeStamp: message.timeStamp

    });

    try {
        await newMessage.save();

    } catch (error) {

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
export async function userOnline(userId) {


    const userStatus = new UserActive({
        userId: userId,

    });

    try {
        await userStatus.save();

    } catch (error) {

    }
};


export async function deleteUserOnline(userId, res) {

    try {

        const result = await UserActive.deleteOne({ userId: userId });
        //  console.log(result)
        // res.status(200).json({
        //     success: true,

        // })

    } catch (error) {
        console.log(error, '.error')
        // return res.status(500).json({ status: false, message: error.message });

    }
};

export async function checkUserOnline(req, res) {

    try {
        const userId = req.params.userId;

        const isOnline = await UserActive.findOne({ userId: userId }).select('userId');

        res.status(200).json({
            success: true,
            isOnline: isOnline
        })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });

    }
};

export async function deleteMessages(req, res) {
  
    const messageId = req.params.messageId;
    try {

   

        const result = await UserChats.deleteOne({
            textId: messageId
        });
    
        res.status(200).json({
            success: true,
            data: result

        })

    } catch (error) {

        return res.status(500).json({ status: false, message: error.message });

    }
};