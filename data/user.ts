import {prisma} from "@/lib/db"

export const getUserByEmail = async (email:string)=>{
    try{
        const user = prisma.user.findUnique({where:{email}})
        return user;
    }
    catch{
        return null
    }
}

export const getUserById = async (id:string)=>{
    try{
        const user = prisma.user.findUnique({where:{id}})
        return user;
    }
    catch{
        return null
    }
}

