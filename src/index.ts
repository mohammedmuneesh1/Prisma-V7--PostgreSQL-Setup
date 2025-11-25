import express, { Request, Response } from 'express'
import { PrismaClient } from './generated/client';
//YOU NEED TO INSTALL PRISMA PG SEPERATLY 
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
const app = express();
const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL 
});

const prisma = new PrismaClient({ adapter });
const PORT = 3000

app.use(express.json());

//CREATE NEW POST 

app.post("/posts",async(req:Request,res:Response)=>{
    const {title, content} = req.body;

    try {
        const post = await prisma.post.create({
            data: {
                title,
                content
            }
        })
        return res.status(200).json({
            success:true,
            response:'Post created successfully',
            data:post,
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            response:'Error creating post',
            error:error instanceof Error ? error.message : `Technical Issue occured at creating Post:${error}`,
        });
    }

});

//GET ALL POSTS 

app.get('/posts',async(req:Request,res:Response)=>{
    try {
        const posts = await prisma.post.findMany();
        return res.status(200).json({
            success:true,
            response:'Posts fetched successfully',
            data:posts,
        });
    } catch (error) {
         return res.status(500).json({
            success:false,
            response:'Error creating post',
            error:error instanceof Error ? error.message : `Technical Issue occured at creating Post:${error}`,
        });
    }
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});