
import UserAuth from "../modals/auth.js"
import { v4 as uuidv4 } from 'uuid';
import { generateJwtToken } from "../helpers/jwt.js";
import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function register(req, res) {

    const auth = req.body // user send data in body from client side
    if (!auth.phone || !auth.password || !auth.name) {
        return res.status(400).json({ success: false, message: "Please provide all fields" })
    }
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(auth.password, saltRounds);
    const token = await generateJwtToken(auth, userId)

    const newUser = new UserAuth({
        userId: userId,
        phone: auth.phone,
        password: hashedPassword,
        name: auth.name,
        token,
        imageUrl: auth.imageUrl
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
        const users = await UserAuth.find({}).select('phone name userId imageUrl')
        //find  will  retrieve multiple documents 
        res.status(200).json({
            success: true,
            data: users,
        })
    } catch (error) {

    }
};

// export async function loginUser(req, res) {
// console.log(req.body)
//     let { name, password } = req.body;


//     if (!name || !password) {
//         return res.status(400).json({ success: false, message: "Please provide all fields" });
//     }


//     try {
//         const user = await UserAuth.findOne({ name: name }).select('phone name userId password token imageUrl')

//         const validPassword = await bcrypt.compare(password, user.password);

//         //find one will  retrieve a single document that matches a specified query 
//         //select will only return the specified data
//         if (!user) {
//             res.status(404).send({ message: "No  User Found" })

//         }
//         else if (!validPassword) {
//             return res.status(400).json({ success: false, message: "username or password is incorrect." })
//         }
//         else {
//             res.status(200).json({ success: true, data: { token: user.token, phone: user.phone, userId: user.userId, name: user.name, imageUrl: user.imageUrl } })
//         }
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error })
//     }
// }


export async function loginUser(req, res) {
    console.log(req.body);
    const { name, password } = req.body;

    // Check for missing fields
    if (!name || !password) {
        return res.status(400).json({ success: false, message: "Fields cannot be empty" });
    }

    try {
        // Find user by name
        const user = await UserAuth.findOne({ name }).select('phone name userId password token imageUrl');

        if (!user) {
            // User not found
            return res.status(404).json({ success: false, message: "No user found with this name" });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: "Username or password is incorrect" });
        }

        // Return success response with user data
        return res.status(200).json({
            success: true,
            data: {
                token: user.token,
                phone: user.phone,
                userId: user.userId,
                name: user.name,
                imageUrl: user.imageUrl,
            },
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
