const express=require('express');
const bodyparser = require('body-parser')
const mongoose=require('mongoose')
const UserSchema=require('./models/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const JWT_SECRET= "kkd746n8c53@$#%@$%40cn54x35435nnnnnfy884trx"

const app=express()

mongoose.connect('mongodb://localhost:27017/login-app-db',{useNewUrlParser:true})

app.use(express.static(__dirname + '/public'));
app.set('viewengine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(bodyparser.urlencoded({extended:true}))


app.get("/",function(req,res){
    res.render("home.ejs")
})







app.get("/login",function(req,res){

res.render("login.ejs")

})






app.post("/login",function(req,res){

    const email=req.body.email
    const pass=req.body.password

    UserSchema.findOne({userName:email},'userName password',function(err,user){
        console.log(user.password)
        console.log(user.userName)

        if(!user){
        return res.json({status:'error', error:"Invalid email/password"})
    }

    if(bcrypt.compare(pass,user.password)){

        const token=jwt.sign({
            id:user._id, 
            email:user.userName
        },
        JWT_SECRET
        )

        // return res.json({status:'ok', data:token})
        res.render("loginsuccess.ejs")
    }
    else{ 

        res.json ({status:'error',error:" inavalid email/password"})

    }

    })


    

   

})



// app.get("/register",function(req,res){

// res.render("register.ejs")



// })




app.post("/register", async function(req,res){

   
    const email=req.body.email
    const pass=req.body.password;

    const hashedPass= await bcrypt.hash(pass,10)

    if(!email || typeof email !== 'string'){
        return res.json({status:'error', error:"Invalid Email"})
    }

    if(!pass || typeof pass !== 'string'){
        return res.json({status:'error', error:'Invalid Password'})
    }



    try{



        const response= await UserSchema.create({
            userName:email,
            password:hashedPass


        })

            console.log("user created successfully: ", response )
            res.render("registeredsuccess.ejs")

    }
    catch(err){
        // console.log(err.message)
        if(err.code === 11000){
            //duplicate key error
            return res.json({status:'error', error: "Email already in use"})
        }
        else
        throw err 
       
    }





   
    })




app.listen(3000, function(){
    console.log("Server started on port 3000");
})