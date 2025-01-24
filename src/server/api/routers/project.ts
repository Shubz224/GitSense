import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
    createpProject : protectedProcedure.input().mutation(async({ctx,input})=>{
        ctx.user.userId
        console.log('hi')
       return true
    })
})

