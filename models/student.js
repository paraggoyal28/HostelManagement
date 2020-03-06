var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var studentSchema = new mongoose.Schema({
   first_name:String,
   last_name:String,
   father_name:String,
   address:String,
   contact:String,
   username:String,
   password:String,
   complaints: [
   {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
    }
    ],
    leave_requests: [
   {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Leave"
    }
    ],
    lostfound: [
   {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LostFound"
    }
    ],
   isAdmin:{type:Boolean,default:false},
   resetPasswordToken:String,
   resetPasswordExpires:Date,
});

studentSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Student",studentSchema);