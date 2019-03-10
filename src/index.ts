import { saveAll,createDB,createCollection,truncateCollection,updateUser,getUser,getAllUsers,getAllUsersWithPost } from "./db";

const bodyparser = require('body-parser');
const express = require('express');
const app = express();
const https = require('https');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

function pushUserData(){
	let usersdata = '';
	https.get('https://jsonplaceholder.typicode.com/users', (resp) => {
		resp.on('data', (chunk) => {
		  usersdata += chunk;
		});
		resp.on('end', () => {
		  saveAll("users",JSON.parse(usersdata));
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

function pushPostsData(){
	let postsdata = '';
	https.get('https://jsonplaceholder.typicode.com/posts', (resp) => {
		resp.on('data', (chunk) => {
			postsdata += chunk;
		});
		resp.on('end', () => {
			pushCommentsData(postsdata);
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

function pushCommentsData(postdata){
	let commentsdata = '';
	https.get('https://jsonplaceholder.typicode.com/comments', (resp) => {
		resp.on('data', (chunk) => {
			commentsdata += chunk;
		});
		resp.on('end', () => {
			saveAll("posts",constructPostData(postdata,commentsdata));
		});
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

function constructPostData(postdata,commentsdata){
	var i=0,j;
	var posts = JSON.parse(postdata);
	var com = JSON.parse(commentsdata)
	for(i=0;i<posts.length;i++){
		var comments=[];
		for(j=0;j<com.length;j++){
			if (posts[i]["id"]==com[j]["postId"]) {
			comments.push(com[j]);
			}
		}
		posts[i]['comments'] = comments;
		i++;
	}
	return posts;
}



app.post('/setup',function(req,res){
	createDB();
	createCollection("users");
	createCollection("posts");
	truncateCollection("users");
	truncateCollection("posts");
	pushUserData();
	pushPostsData();
	res.send("{\"Response\" : 200,\"message\":\"datasets pushed to the mongodb successfully\"}");
});

app.get('/user',function(req,res){
	var userid=req.query.userid
	var response = "";
	if(!userid){
		getAllUsers(res);
	}
	else{
		getUser(userid,res);
	}
});

app.put('/user',function(req,res){
  console.log(req.body);
  var userid=req.body.userid
  var response = "";
  updateUser(req.body.userid,req.body.field,req.body.newvalue,res);
});

app.get('/userspost',function(req, res){
  getAllUsersWithPost(req.query.userid, res);
});






app.get('/', function(req, res){
  res.send('Hello HopeResearch!')
});

app.listen(3000, function(){
  console.log('Example app listening on port 3000!')
});