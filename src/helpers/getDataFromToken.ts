import jwt from 'jsonwebtoken'

export const getDataFromToken = async (token: string) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {id : string}
        return decodedToken.id
    } catch (error) {
        console.error("Invalid Token", error instanceof Error ? error.message : error)
        return null
    }
}
