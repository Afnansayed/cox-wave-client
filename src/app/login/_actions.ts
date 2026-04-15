import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/token.utils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";



export const loginAction = async (payload : ILoginPayload ) : Promise<ApiResponse<ILoginResponse> | ApiErrorResponse> =>{
    const parsedPayload = loginZodSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {

        const response = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);
        console.log(response.data);

        const { accessToken, refreshToken, token} = response.data;
        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); 

        return response;
        
    } catch (error : any) {
        return {
            success: false,
            message: `Login failed: ${error.message}`,
        }
    }
} 