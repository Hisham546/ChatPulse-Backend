import jwt from 'jsonwebtoken';


export const generateJwtToken = async (auth, userId) => {
  

    try {
        return jwt.sign({ name: auth.name, userId: userId }, process.env.JWT_SECRET ,{ expiresIn: '24h' });
    } catch (error) {
        console.log(error,'....jwt error')
    }
};

