"use server"

import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { AuthError } from "next-auth"

export const login = async (values: z.infer<typeof LoginSchema>) =>{
    const validatedFields = LoginSchema.safeParse(values)

    if(!validatedFields.success){
        return {error: "Invalid Fields"}
    }
    const {email, password} = validatedFields.data
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        if(error instanceof AuthError){
            console.log(error)
            switch(error.type){
                case "CallbackRouteError":
                    return {error: "Callback Route Error"}
                case "CredentialsSignin":
                    return {error: "Invalid Credentials"}
                default:
                    return {error: "Something went wrong"}
            }
        }
        throw error;
    }
}


// TODO: If invalid credentials are entered it is giving CallbackRouteError, Instead of Invalid Credentials, which should be fixed.


