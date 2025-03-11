import jwt from 'jsonwebtoken'

export const generateToken = async(id)=>{
    return jwt.sign(
        {userId : id}, 
        process.env.JWT_SECRET,
        {expiresIn : '10d'}
    )
}