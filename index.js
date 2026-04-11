const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const {v4 : uuidv4} = require('uuid');
const methodOverride = require("method-override");


app.use (express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static (path.join(__dirname,"public")));

let tasks = [
    
];

app.get("/tasks" , (req ,res ) => {
  res.render("index.ejs", { tasks });
}); 

app.get("/tasks/new" , (req ,res ) => {
res.render("new.ejs");
});

app.post("/tasks", (req ,res ) => {
let { title, details} = req.body;
let id = uuidv4();
tasks.push({ id, title, details ,isDone: false}); 
res.redirect("/tasks");
});

app.patch("/tasks/:id/done", (req, res) => {
    let { id } = req.params;
    let task = tasks.find((p) => id === p.id);
    if (task) {
        task.isDone = !task.isDone; // Toggles between true/false
    }
    res.redirect("/tasks");
});

app.get("/tasks/:id" , (req ,res ) => {
 let {id} = req.params;
 console.log(id);
 let task = tasks.find(  (p) => id==p.id);
 if (!task) {
        // If task is not found, we pass an error to the middleware
        let err = new Error("Task not found!");
        err.status = 404;
        return next(err); 
    }
 res.render("show.ejs",{task});
}); 


app.patch("/tasks/:id", (req , res) => {
 let {id} = req.params;
 let newDetails = req.body.details;
 let task =tasks.find((p) => id==p.id);
 task.details = newDetails;
 console.log(task); 
    res.redirect("/tasks");
});

app.get("/tasks/:id/edit", (req , res) => {
    let {id} = req.params;
    let task =tasks.find((p) => id ==p.id);
    res.render("edit.ejs" ,{task});
});
// This happens when you click "Delete" on the home page
app.get("/tasks/:id/delete", (req, res) => {
    let { id } = req.params; // Get the ID from the URL
    
    // Find that specific task in your array so we can show its title on the delete page
    let task = tasks.find((p) => id === p.id);
    
    // Send the user to the delete.ejs page with that task's data
    res.render("delete.ejs", { task });
});
// This triggers when the form on delete.ejs is submitted
app.delete("/tasks/:id", (req, res) => {
    let { id } = req.params;
    
    // filter() creates a NEW list that leaves out the one with the matching ID
    tasks = tasks.filter((p) => id !== p.id);
    
    // Go back to the home page (index.ejs) to see the updated list
    res.redirect("/tasks");
});


app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    console.error(err.stack); 
    res.status(status).render("error.ejs", { message });
});
app.listen (port ,() => {
    console.log("listening to port  : 8080");
})