import jwt from "jsonwebtoken"


const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).send({success:false, message:"Not Authorized. Pleas Login"})
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: token_decode.id, role: token_decode.role };
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({success:false, message:"Error"})
    }
}

export default authMiddleware;