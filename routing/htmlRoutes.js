//Get Dependencies
const path = require("path"),
 request = require("request"),
 handlebars = require("express-handlebars"),
 express = require("express");
 
//Allow this file to be used as a function
module.exports = function(app){

 //setup handlebars templating and detault views
 app.engine(".hbs", handlebars({  
  defaultLayout: path.join(__dirname, '..', 'public/views/layouts/main.hbs'),
  layoutsDir: path.join(__dirname, '..', 'public/views/layouts')
 }));
 app.set('views', path.join(__dirname, '..', 'public', 'views'));
 app.set("view engine", ".hbs");

 //Route to serve the index page
 app.get("/survey", function(req, response){
   response.render("survey");
 });//survey get function

 //Route to get form information and display a match
 app.post("/survey", function(req, response){

 	let userResponses = []; //array for user responses

 	//get all the responses from our new user and put it in an array
 	for (var i = 1; i < 11; i++) {
 		userResponses.push(parseInt(req.body[`range${i}`]));
 	}

 	//get users by using the /api route
 	request('http://' + req.get('host') + '/api', (err, res, body)=>{
  	let users = JSON.parse(body);

  	let differences = [], matchIndex; //local variables for calculations

  	//loop through all users, get the difference in their scores and put in array
  	for (user of users){
  		differences.push(diff(user.scores, userResponses)); 
  	}

  	//get the index of the closes match (smallest difference)
  	matchIndex = differences.indexOf(Math.min.apply(Math, differences));

  	//add new user to our DB using the /add post call
 	request.post({url:'http://' + req.get('host') + '/add', 
 		form: {'name':req.body.name, 'photo':req.body.photo, 'scores':userResponses,}});

 	//show user their closest match
  	response.render("yourthot", users[matchIndex]);
  });
 });//survey post function

 //Catchall route that leads to the homepage
 app.get("*", function(req, response){

 	//get all users with /api call
  	request('http://' + req.get('host') + '/api', (err, res, body)=>{

  	//send data to be rendered via index view
   	response.render("index", {users : JSON.parse(body)});
  });
 });//index get function

//function to loop through 2 int arrays, get the diff at each index, and return their sum
diff = function(a, b) {
	let result = 0;
	for (index in a){
		result += Math.abs(a[index]-b[index]);
	}
    return result;
};

}//end of exports