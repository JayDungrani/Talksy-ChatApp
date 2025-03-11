import jwt from 'jsonwebtoken'

export const generateToken = async(id)=>{
    jwt.sign(
        {id : id}, 
        process.env.JWT_SECRET,
        {expiresIn : '10d'}
    )
}