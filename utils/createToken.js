import jwt from "jsonwebtoken";

const createToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '5d'})

    res.cookie('jwt', token, {
        httpOnly: true,
        secure:process.env.NODE_ENV !== 'development',
        sameSite:'strict',
        maxAge:5 * 24 * 60 * 60 * 1000
    })

    return token

}

export default createToken;