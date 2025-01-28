import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollCommits } from "@/lib/github";


export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ ctx, input }) => {
        // Create the project first
        const UserId = ctx.user.userId;
        const project = await ctx.db.project.create({
            data: {
                githubUrl: input.githubUrl,
                name: input.name,
                UserToProjects: {
                    create: {
                        userId: UserId!,
                    }
                }
            },

            
        })
        
    await pollCommits(project.id)
            
        return project;
    }),

    getProjects: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.project.findMany({
            where: {
                UserToProjects: {
                    some: {
                        userId: ctx.user.userId!
                    }
                },
                deletedAt: null
            }

        })
    }),

   getCommits:protectedProcedure.input(z.object({
         projectId: z.string()
   })).query(async({ctx,input})=>{
         return await ctx.db.commit.findMany({
              where:{
                projectId:input.projectId
              }
         })
   })


});
