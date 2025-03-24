import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
    console.log("Received Cookies:", req.cookies);
    const token = req.cookies.jwtToken;
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.token = decoded
        next()
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            res.clearCookie("token", 
                { httpOnly: true, secure: true, sameSite: "strict" }
            )
            return res.status(401).json({ message: "Session expired", redirect : "/login"});
        }
        return res.status(401).json({ message: "Invalid token" })
    }
}

export default authMiddleware;
