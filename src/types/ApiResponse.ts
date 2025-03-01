import { LoginStatus } from "@/models/user.model"
export default interface ApiResponse{
    success:boolean,
    message:string,
    LoginStatus?:LoginStatus,
    premiumTaken?:boolean
}