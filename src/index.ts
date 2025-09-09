// import express from "express";
// import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import { ContentModel, LinkModel, UserModel } from "./db.js";
// import { userMiddleware } from "./middleware.js";
// import { JWT_PASSWORD } from "./config.js";
// import { random } from "./utils.js";
// //@ts-ignore
// import cors from "cors"; 
// const app= express();

// app.use(cors({
//     origin: "http://localhost:5173", // Your frontend URL
//     credentials: true
// }));

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("🚀 Brainly API is running! Use /api/v1/... endpoints");
// });


// app.post("/api/v1/signup",async (req,res)=>{
//     const username= req.body.username;
//     const password = req.body.password;

//     try{
//     await UserModel.create({
//         username:username,
//         password:password
//     })

//     res.json({
//         message:"User signed up"
//     })
// }  catch(e){
//     res.status(411).json({
//         message:"User already exists"
//     })
// }
// })

// app.post("/api/v1/signin",async(req,res)=>{
//     const username = req.body.username;
//     const password=req.body.password;
//     const existingUser = await UserModel.findOne({
//         username,
//         password
//     })
//     if (existingUser){
//         const token = jwt.sign({
//             id:existingUser._id
//         },JWT_PASSWORD)

//         res.json({
//             token
//         })
//     }else{
//         res.status(403).json({
//             message:"Incorrect credentials"
//         })
//     }
// })

// app.post ("/api/v1/content",userMiddleware,async(req,res)=>{
//     const link = req.body.link;
//     const type=req.body.type;
//     await ContentModel.create({
//         link,
//         type,
//         //@ts-ignore
//         userId:req.userId,
//         tags:[]
//     })
//     return res.json({
//         message:"Content added"
//     })
// })

// app.get("/api/v1/content",userMiddleware, async (req,res)=>{
//     //@ts-ignore
//     const userId=req.userId;
//     const content = await ContentModel.find({
//         userId:userId
//     }).populate("userId","username")
//     res.json({
//         content
//     })

// })
// app.delete("/api/v1/content",userMiddleware,async(req,res)=>{
//     const contentId= req.body.contentId;
//     await ContentModel.deleteMany({
//         contentId,
//         //@ts-ignore
//         userId:req.userId
//     })
//     res.json({
//         message:"Deleted"
//     })
// })
// app.post("/api/v1/brain/share",userMiddleware,async (req,res)=>{
//     const share=req.body.share;
//     if(share){
//         const existingLink= await LinkModel.findOne({
//             userId:req.userId
//         });

//         if(existingLink){
//             res.json({
//                 hash:existingLink.hash
//             })
//             return;
//         }
//         const hash = random(10);
//         await LinkModel.create({
//             //@ts-ignore
//             userId:req.userId,
//             hash:hash
//         })

//         res.json({
//             hash
//         })
//     }else {
//         await LinkModel.deleteOne({
//             //@ts-ignore
//             userId:req.userId
//         });
//     }

//     res.json({
//         message:"Updated sharable Link"
//     })
// })
// app.get("/api/v1/brain/:shareLink",async(req,res)=>{
//     const hash = req.params.shareLink;

//     const link= await LinkModel.findOne({
//         hash
//     });
//     if(!link){
//         res.status(411).json({
//             message:"Sorry incorrect input"
//         })
//         return;
//     }
//     const content = await ContentModel.find({
//         userId:link.userId
//     })
//     const user= await UserModel.findOne({
//         _id:link.userId
//     })

//     // if(!user){
//     //     res.status(411).json({
//     //         message:"user not found,error should ideally not happen"
//     //     })
//     //     return;
//     // }
//     res.json({
//         username:user?.username,
//         content:content
//     })
// })
// app.listen(3000);
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db.js";
import { userMiddleware } from "./middleware.js";
import { JWT_PASSWORD } from "./config.js";
import { random } from "./utils.js";
//@ts-ignore
import cors from "cors"; 
const app= express();

// Updated CORS configuration to allow your deployed domain
app.use(cors({
    origin: [
        "http://localhost:5173", // Local development
        "http://bgocg8kscw480og0wok8kc.49.13.9.90.sslip.io", // Your deployed domain
        "https://bgocg8kscw480og0wok8kc.49.13.9.90.sslip.io" // HTTPS version if needed
    ],
    credentials: true
}));

// Alternative: Allow all origins for testing (less secure)
// app.use(cors({
//     origin: true,
//     credentials: true
// }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Brainly API is running! Use /api/v1/... endpoints");
});

app.post("/api/v1/signup",async (req,res)=>{
    const username= req.body.username;
    const password = req.body.password;

    try{
    await UserModel.create({
        username:username,
        password:password
    })

    res.json({
        message:"User signed up"
    })
}  catch(e){
    res.status(411).json({
        message:"User already exists"
    })
}
})

app.post("/api/v1/signin",async(req,res)=>{
    const username = req.body.username;
    const password=req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser){
        const token = jwt.sign({
            id:existingUser._id
        },JWT_PASSWORD)

        res.json({
            token
        })
    }else{
        res.status(403).json({
            message:"Incorrect credentials"
        })
    }
})

app.post ("/api/v1/content",userMiddleware,async(req,res)=>{
    const link = req.body.link;
    const type=req.body.type;
    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId:req.userId,
        tags:[]
    })
    return res.json({
        message:"Content added"
    })
})

app.get("/api/v1/content",userMiddleware, async (req,res)=>{
    //@ts-ignore
    const userId=req.userId;
    const content = await ContentModel.find({
        userId:userId
    }).populate("userId","username")
    res.json({
        content
    })

})

app.delete("/api/v1/content",userMiddleware,async(req,res)=>{
    const contentId= req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId:req.userId
    })
    res.json({
        message:"Deleted"
    })
})

app.post("/api/v1/brain/share",userMiddleware,async (req,res)=>{
    const share=req.body.share;
    if(share){
        const existingLink= await LinkModel.findOne({
            userId:req.userId
        });

        if(existingLink){
            res.json({
                hash:existingLink.hash
            })
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            //@ts-ignore
            userId:req.userId,
            hash:hash
        })

        res.json({
            hash
        })
    }else {
        await LinkModel.deleteOne({
            //@ts-ignore
            userId:req.userId
        });
    }

    res.json({
        message:"Updated sharable Link"
    })
})

app.get("/api/v1/brain/:shareLink",async(req,res)=>{
    const hash = req.params.shareLink;

    const link= await LinkModel.findOne({
        hash
    });
    if(!link){
        res.status(411).json({
            message:"Sorry incorrect input"
        })
        return;
    }
    const content = await ContentModel.find({
        userId:link.userId
    })
    const user= await UserModel.findOne({
        _id:link.userId
    })

    // if(!user){
    //     res.status(411).json({
    //         message:"user not found,error should ideally not happen"
    //     })
    //     return;
    // }
    res.json({
        username:user?.username,
        content:content
    })
})

// Make sure to use the PORT environment variable or default to 3000
const PORT = parseInt(process.env.PORT || '3000');
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});