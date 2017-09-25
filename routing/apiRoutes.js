//load dummy data if not already loaded
var db = db || require("../data/thots.js");

//Allow this file to be used as a function
module.exports = function(app){

 //setup api route to return all users in our database
 app.get("/api", (request, response)=>{
  response.json(db);
 });

 //setup api route to add a user to our database
 app.post("/add", (req, res)=>{
	db.push(req.body)
 });

};//module export function