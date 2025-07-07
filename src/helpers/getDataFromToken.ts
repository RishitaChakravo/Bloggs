import jwt from 'jsonwebtoken'

export const getDataFromToken = async (token: string) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {id : string}
        return decodedToken.id
    } catch (error: any) {
        console.error("Invalid Token")
        return null
    }
}