
import UserChats from "../modals/message.js";

import UserActive from "../modals/activeStatus.js"
export async function saveChats(message) {


    const newMessage = new UserChats({
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

        await UserActive.deleteOne({ userId: userId });

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

        const isOnline = await UserActive.exists({ userId });

        res.status(200).json({
            success: true,
            isOnline: isOnline
        })

    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });

    }
};