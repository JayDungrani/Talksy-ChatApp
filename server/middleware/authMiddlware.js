import jwt from 'jsonwebtoken'

const authMiddleware = async(req, res, next)=>{
    const token = req.cookies.jwtToken;

    if(!token){
        return res.status(401).json({message : "Access denied. No token provided."})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.token = decoded
        next()
    }
    catch (error) {
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({ message: "Session expired"});
        }
        return res.status(401).json({message : "Invalid or expired token"})
    }
}

export default authMiddleware;