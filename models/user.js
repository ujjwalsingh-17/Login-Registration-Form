const mongoose=require('mongoose');

const userSchema= new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    }
},
    {
        collections: 'users'
    }
)


const model =mongoose.model('UserSchema', userSchema)

module.exports=model