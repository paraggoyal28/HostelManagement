var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride=require("method-override");
var flash=require("connect-flash");

var passport=require("passport");
var localStrategy=require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var Student=require("./models/student");
var Admin=require("./models/admin");
var Complaints=require("./models/complaints");
var Leave=require("./models/leave_requests");
var LostFound=require("./models/lost_found");

var port = 3000 || process.env.PORT;
var host = '127.0.0.1' || process.env.HOST;

// Student.create(
//     {
//         username:"admin1234",
//         password:"admin"
//     },function(err,user){
//       if(err){
//           console.log(err);
//       }
//       else{
//           console.log(user);
//       }
//     });

app.use(express.static('img'));

app.use(require("express-session")({
    secret:"adventure28",
    resave:false,
    saveUninitialized:false
}));

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb://localhost/jecrc");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

app.get("/",function(req,res){
  res.render("landing2");
});

app.get("/viewhostels",function(req,res){
  res.render("hostels");
});

app.get("/studentlogin",function(req,res){
  res.render("index11STD");
});

app.get("/adminlogin",function(req,res){
  res.render("index11ADMIN");
});

app.post("/studentlogin",function(req, res) {
    console.log("Hello");
    console.log(req.body.username);
    console.log(req.body.password);
  Student.find({username:req.body.username},function(err,found){
     if (found[0].password == req.body.password){
      res.redirect("/home/student/"+found[0]._id);
      console.log("success");
     }
     else{
         res.redirect("/studentlogin");
         console.log(found);
         console.log("actual pass = "+found[0].password);
     }
   });
});


app.post("/adminlogin",function(req, res) {
    console.log("Hello");
    console.log(req.body.username);
    console.log(req.body.password);
  Student.find({username:req.body.username},function(err,found){
    if(found.length >=1){
     if (found[0].password == req.body.password){
      res.redirect("/home/admin");
      console.log("success");
     }
     else{
         res.redirect("/adminlogin");
         console.log(found);
         console.log("actual pass = "+found[0].password);
     }
   }
   else{
       res.redirect("/adminlogin");
   }
   });
});

app.get("/displaycomplains",function(req,res){
    console.log("Your are HEre");

    Complaints.find({},function(err,found){
       if(!err){
           console.log("success fulle found "+found);
           var complaints;
           res.render("displaycomplaints" ,{complaints:found});
       }
    });

});

app.get("/displayleaves",function(req,res){
    console.log("Your are HEre");

    Leave.find({},function(err,found){
       if(!err){
           console.log("success fulle found "+found);
           var leaves;
           res.render("displayleaves" ,{leaves:found});
       }
    });

});

app.get("/forms", function(req,res){
    res.render("forms");
});

app.get("/leave_request", function(req,res){
    res.render("leave_form");
});

app.get("/logout",function(req, res) {
    res.redirect("/landing2");
});

app.get("/home/student/:id",function(req,res){
  res.render("studenthome");
});

app.get("/home/admin",function(req,res){
  console.log("login success");
  res.render("adminHome");
});

app.post("/complaint",function(req, res) {
    var complaint={
        title:req.body.title,
        image:req.body.image,
        description:req.body.content,
        type:req.body.type,
        // author:{
        //     id:req.user._id,
        //     username:req.user.username
        // }
    }
    Complaints.create(complaint,function(err,complaint){
       if(err){
           console.log(err);
       }
       else{
        //   Student.findById(req.user._id,function(err,founduser){
        //       if(err){
        //           console.log(err);
        //       }
        //       else{
        //           founduser.complaints.push(complaint);
        //           founduser.save();
        //           res.redirect("home/student/"+req.user._id);
        //       }
        //   });
        console.log("Complaint success");
        console.log(complaint);
        res.redirect("home/student/222");
       }
    });
});

app.post("/leave_req",function(req, res) {
    var leave={
        request:req.body.request,
        author:{
            username:"STUDENT XYZ"
        }
    }
    Leave.create(leave,function(err,leave){
       if(err){
           console.log(err);
       }
       else{
        //   Student.findById(req.user._id,function(err,founduser){
        //       if(err){
        //           console.log(err);
        //       }
        //       else{
        //           founduser.complaints.push(complaint);
        //           founduser.save();
        //           res.redirect("home/student/"+req.user._id);
        //       }
        //   });
        console.log("Leave Request add success");
        console.log(leave);
        res.redirect("home/student/222");
       }
    });
});

app.post("/leaverequest",function(req, res) {
    var leavereq={
        request:req.body.request,
        author:{
            id:req.user._id,
            username:req.user.username
        }
    }
    Leave.create(leavereq,function(err,complaint){
       if(err){
           console.log(err);
       }
       else{
           Student.findById(req.user._id,function(err,founduser){
              if(err){
                  console.log(err);
              }
              else{
                  founduser.leave_request.push(leavereq);
                  founduser.save();
                  res.redirect("home/student/"+req.user._id);
              }
           });
       }
    });
});

app.post("/lostitem",function(req, res) {
    var lostitem={
        item:req.body.item,
        image:req.body.image,
        description:req.body.description,
        type:'LOST',
        author:{
            id:req.user._id,
            username:req.user.username
        }
    }
    LostFound.create(lostitem,function(err,lostitem){
       if(err){
           console.log(err);
       }
       else{
           Student.findById(req.user._id,function(err,founduser){
              if(err){
                  console.log(err);
              }
              else{
                  founduser.lostfound.push(lostitem);
                  founduser.save();
                  res.redirect("home/student/"+req.user._id);
              }
           });
       }
    });
});

app.post("/founditem",function(req, res) {
    var founditem={
        item:req.body.item,
        image:req.body.image,
        description:req.body.description,
        type:'FOUND',
        author:{
            id:req.user._id,
            username:req.user.username
        }
    }
    LostFound.create(founditem,function(err,founditem){
       if(err){
           console.log(err);
       }
       else{
           Student.findById(req.user._id,function(err,founduser){
              if(err){
                  console.log(err);
              }
              else{
                  founduser.lostfound.push(founditem);
                  founduser.save();
                  res.redirect("home/student/"+req.user._id);
              }
           });
       }
    });
});



app.listen(port , host , function(){
  console.log("Server running at : http:/"+host+":"+port+"/");
});
