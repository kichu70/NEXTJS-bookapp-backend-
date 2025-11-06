import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true

    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    role: {
      type: String, 
      required: true,
      enum: ["User", "Admin"],//----
      default:"User",
    },
    verify:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const user = mongoose.model("userData",UserSchema)

export default user;