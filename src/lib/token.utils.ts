"use server"

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookie.utils";


const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

const getTokenSecondsRemaining =  (token: string): number => {
    if(!token) return 0;

    try {
        const decoded = JWT_ACCESS_SECRET
            ? jwt.verify(token, JWT_ACCESS_SECRET as string)
            : jwt.decode(token);

        if (!decoded || typeof decoded === "string" || !("exp" in decoded)) {
            return 0;
        }

        const tokenPayload = decoded as JwtPayload;
        if (typeof tokenPayload.exp !== "number") {
            return 0;
        }

        const remainingSeconds = tokenPayload.exp - Math.floor(Date.now() / 1000)

        return remainingSeconds > 0 ? remainingSeconds : 0;

    } catch (error) {
        console.error("Error decoding token:", error);
        return 0;
    }
} 

export const setTokenInCookies = async (
    name : string,
    token : string,
    fallbackMaxAgeInSeconds = 60 * 60 * 24 
) => {
    let maxAgeInSeconds = 0;

    if(name !== "better-auth.session_token"){
     maxAgeInSeconds = getTokenSecondsRemaining(token);
    }

    await setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds);
}