//Get the heroku or local port
const PORT = process.env.PORT || 3000;

//Get module dependencies
var express = require("express"),
 app = express(),
 bodyParser = require("body-parser"),
 path = require("path");

 //Set the public folder to access images and assets easily
app.use(express.static('public'));

//setup easy access to response objects
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(bodyParser.text());
 app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//send the express objects to the routing scripts
 require("./routing/apiRoutes.js")(app);
 require("./routing/htmlRoutes.js")(app);

//start the server
 app.listen(PORT, function (err) {
 	if(err){console.log(err);}
 	console.log(`Listening on port ${PORT}`);
 }); 

