import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = async(userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '15d'});
    res.cookie('jwt', token, {
        httpOnly: true, // more secure
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        sameSize: 'strict', //CSRF
        secure: process.env.NODE_ENV === 'development', // https only in development
    });
    return token;
}

export default generateTokenAndSetCookie;
