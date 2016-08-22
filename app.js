'use strict';

const express = require('express');
let bodyParser = require('body-parser');
let app = express();
let port = process.env.PORT || 3000;
var redis = require('redis');
var client = redis.createClient(); //creates a new client
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/recipes', (req,res) => {

client.lrange('papares', 0, -1, function(err, reply) {
      res.send(reply); // ['angularjs', 'backbone']
});
})

app.post('/', (req,res) => {
  

})

app.get('/recipes/:id' , (req,res) => {
  res.send('your recipe');

})
app.put('/recipes/:id', (req,res) => {

  res.send('your request');
});

app.delete('/recipes/:id' , (req,res) => {
  res.send('deleted')
});

app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
})



client.on('connect', function() {
      console.log('connected to redis db');
});


let testRecipe = JSON.stringify({
  name:"bales",
  ingredients:["ingredient4" , "ingredient5", "ingredient3"]
});


client.hmset('giwnia', 'soup3', testRecipe);
client.rpush(['papares', testRecipe], function(err, reply) {
      console.log(reply); //prints 2
});
