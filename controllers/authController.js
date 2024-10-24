
import UserAuth from "../modals/auth.js"
import { v4 as uuidv4 } from 'uuid';
export async function register(req, res) {

    const auth = req.body // user send data in body from client side
    if (!auth.phone || !auth.password || !auth.name) {
        return res.status(400).json({ success: false, message: "Please provide all fields" })
    }
    const userId = uuidv4();
    const newUser = new UserAuth({
        userId: userId,
        phone: auth.phone,
        password: auth.password,
        name: auth.name
    })

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser })
    } catch (error) {
        console.log('error:', error)
        res.status(500).json({ success: false, message: "server error" })

    }
};


export async function fetchAllUsers(req, res) {

    try {
        const users = await UserAuth.find({}).select('phone name')
        //find  will  retrieve multiple documents 
        res.status(200).json({
            success: true,
            data: users,
        })
    } catch (error) {

    }
};

export async function loginUser(req, res) {

    let { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }
    try {
        const user = await UserAuth.findOne({ name: name, password: password }).select('phone name')
        //find one will  retrieve a single document that matches a specified query 
        //select will only return the specified data
        if (!user) {
            res.status(404).send({ message: "No  User Found" })
        } else {
            res.status(200).json({ success: true, data: user })
        }
    } catch (error) {
        console.log(error)
    }
}