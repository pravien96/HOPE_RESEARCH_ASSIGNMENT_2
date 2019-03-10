var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/master";

export function createDB() {
		MongoClient.connect(url+"master", function(err, db) {
  		if (err) throw err;
  		console.log("Database created!");
  		db.close();
	});
}

export function createCollection(name:string) {
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("master");
	  dbo.createCollection(name, function(err, res) {
	    if (err) throw err;
	    console.log("Collection created!");
	    db.close();
	  });
	});
}

export function saveAll(collectionName, data) {
	MongoClient.connect(url, function(err, db) {
	  console.log(data);
	  if (err) throw err;
	  var dbo = db.db("master");
	  dbo.collection(collectionName).insertMany(data, function(err, res) {
	    if (err) throw err;
	    console.log("all data inserted");
	    db.close();
	  });
	});
}

export function truncateCollection(name:string) {
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var myquery = {};
	  var dbo = db.db("master");
	  dbo.collection(name).remove(myquery, function(err, obj) {
	    if (err) throw err;
	    console.log(obj.result.n + " document(s) deleted");
	    db.close();
	  });
	});
}

export function updateUser(userid:string, field:string, value:string, response){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("master");
	  console.log(JSON.parse("{\""+field+"\":"+value+"}"));
	  dbo.collection("users").updateOne({"id":parseInt(userid)}, {$set:JSON.parse("{\""+field+"\":\""+value+"\"}")}, function(err, result) {
	    if (err) throw err;
	    db.close();
	    response.send(result);
	  });
	});
}

export function getUser(userid, response) {
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("master");
	  dbo.collection("users").findOne({'id':parseInt(userid)}, function(err, result) {
	    if (err) throw err;
	    db.close();
	    response.send(result);
	  });
	});
}

export function getAllUsers(response) {
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("master");
	  dbo.collection("users").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    db.close();
	    response.send(result);
	  });
	});
}

export function getAllUsersWithPost(userid:string, response){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("master");
	  dbo.collection('users').aggregate([
	    { $lookup:
	       {
	         from: 'posts',
	         localField: 'id',
	         foreignField: 'userId',
	         as: 'posts'
	       }
	     },
	     {
	     	$match:{
	     		$and:[
	     			{
	     				"id":parseInt(userid)
	     			}
	     		]
	     	}
	     }
	    ]).toArray(function(err, res) {
	    if (err) throw err;
	    db.close();
	    response.send(res);

	  });
	});
}