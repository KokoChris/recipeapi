'use strict';
const express = require('express');
let bodyParser = require('body-parser');
let app = express();
let port = process.env.PORT || 3000;
var redis = require('redis');
var client = redis.createClient(process.env.REDIS_URL); //creates a new client
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/recipes', (req,res) => {
    client.hgetall('recipes',(err,recipesObj) => {
        if (recipesObj){
            let listOfRecipes = Object.keys(recipesObj).map(key => recipesObj[key]) 
	    res.status(200).send(listOfRecipes);
	} else {
	  res.send([]);
        }
    })
})

app.post('/api/recipes', (req,res) => {
  client.incr('recipekey',(err,reply)=> {
     console.log(req.body);
     let recipeId = reply;
     let title = req.body.title;
     let ingredients = req.body.ingredients;
     let recipe = JSON.stringify({
       recipeId,
       title,
       ingredients
     });
     client.hmset('recipes',`recipe:${recipeId}`,recipe, (err)=> {
       if (err) {
         throw err;	
	 res.send('something went wrong');
       } else {
         res.status(201).send('new recipe created');
       }
    })
  })
  

})

app.get('api/recipes/:id' , (req,res) => {
  let recipeId = req.params.id;
  client.hget('recipes', `recipe:${recipeId}`, (err,recipe) => {
        if(err) {
	   throw err;
	   res.status(404).send('could not retrieve recipe');
	} else {
           res.status(200).send(recipe);
	}
  });

})
app.put('api/recipes/:id', (req,res) => {
  let recipeId = req.params.id;
  client.hexists('recipes', `recipe:${recipeId}`,(err,recipeExists) => {
  	if(err){
		throw err;
		res.send('could not update resource');
	} else if (!recipeExists) {

	   
          res.status(404).send('recipe was not found, nothing to update here')
	
          
	} else {

	 	 let recipeId = req.params.id;
	  	 let title = req.body.title;
         	 let ingredients = req.body.ingredients;
	 	 let updatedRecipe = JSON.stringify({
	       		recipeId,
       	      	         title,
               		ingredients
     		  });
          
	 	client.hmset('recipes',`recipe:${recipeId}`, updatedRecipe,(err)=> {
	   		if(err) {
		         	throw err;
 			} else {
			       res.send('resource updated');      
			}
          	});	
	}
  }); 
     
});

app.delete('api/recipes/:id' , (req,res) => {
  let recipeId = req.params.id;
  client.hdel('recipes',`recipe:${recipeId}`,(err)=> {
         if(err){
	   throw err;
	 } else {
           res.send('done');
	 } 
  });
});

app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
})

client.on('connect', function() {
      console.log('connected to redis db');
});
  
