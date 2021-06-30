const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

const dbConnectionUrl = "mongodb+srv://Kuba:Kuba1234@vue-node.jhajn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Get Posts

router.get('/', async (req, res) => {
	await loadPostsCollection(function(dbCollection){
			dbCollection.find().toArray(function(err, result){
				res.send(result);
			});
		});
});

// Add Post

router.post('/', async (req, res) => {
	await loadPostsCollection(function(dbCollection){
		dbCollection.insertOne({
			text: req.body.text,
			createdAt: new Date()
		});
	});
	res.status(201).send();
});

// Delete Post

router.delete("/:id", async(req, res)=> {
	await loadPostsCollection(function(dbCollection){
		dbCollection.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
	});
	res.status(200).send();
});

// Edit Post

router.put("/:id", async(req, res)=> {
	await loadPostsCollection(function(dbCollection){
		dbCollection.updateOne(
			{ _id : new mongodb.ObjectID(req.params.id) }, 
			{ $set: {text: req.body.text, createdAt: new Date()} }
		);
	});
	res.status(200).send();
});

// Get the collection from a database 

async function loadPostsCollection(successCallback){
  mongodb.MongoClient.connect(dbConnectionUrl,function(err, dbInstance){
    const dbObject = dbInstance.db('test');
      const dbCollection = dbObject.collection('posts');
        console.log("[MongoDB connection] SUCCESS");
    successCallback(dbCollection);
  });
}

module.exports = router;