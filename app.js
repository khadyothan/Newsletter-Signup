//jshint esversion:6

const express = require("express");

const bodyParser = require("body-parser");

const request = require("request");

const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));


app.get("/", function (req, res){
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res){
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var emailAddress = req.body.emailAddress;

  var data = {
    members: [
      {
        email_address: emailAddress,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  const options = {
      method: "POST",
      auth: "Khadyothan:db6e03ace082a7eff9de2aa8e23345fc-us6"
  };

  const url = "https://us6.api.mailchimp.com/3.0/lists/94914b4017";
  const request = https.request(url, options, function(response){

    response.on("data", function(data){

      const receivedData = JSON.parse(data);
      console.log(receivedData);
      if(receivedData.error_count == 0){ //if we use response.statsCode it wont work
        // because it only checks whether the post request was sucessful or not like apikeys listid kind of
        res.sendFile(__dirname + "/success.html");
      }else{
        res.sendFile(__dirname + "/failure.html");
      };
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});



//API Key
//db6e03ace082a7eff9de2aa8e23345fc-us6

//list ID
// 94914b4017

//DEPLOYED SERVER LINK
//https://blooming-shelf-83147.herokuapp.com/
