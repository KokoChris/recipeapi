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

    client.hgetall('recipes',(err,reply) => {
        res.send(reply);
    });
})

app.post('/recipes', (req,res) => {

  client.incr('recipekey',(err,reply)=> {
     let recipeId = reply;
     let title = 'testing a bit';
     let ingredients = 'first,second and one more';
     let recipe = JSON.stringify({
     
       recipeId,
       title,
       ingredients
     
     
     });
     client.hmset('recipes',`recipe:${recipeId}`,recipe)
     res.send('it worked');

  });
  

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


  
