import {z} from 'zod';



export const verifyCodeSchema = z.object({
    otp:z.string().length(6,'verification code should be of 6 characters')
})