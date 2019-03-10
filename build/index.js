"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./db");
var bodyparser = require('body-parser');
var express = require('express');
var app = express();
var https = require('https');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
function pushUserData() {
    var usersdata = '';
    https.get('https://jsonplaceholder.typicode.com/users', function (resp) {
        resp.on('data', function (chunk) {
            usersdata += chunk;
        });
        resp.on('end', function () {
            db_1.saveAll("users", JSON.parse(usersdata));
        });
    }).on("error", function (err) {
        console.log("Error: " + err.message);
    });
}
function pushPostsData() {
    var postsdata = '';
    https.get('https://jsonplaceholder.typicode.com/posts', function (resp) {
        resp.on('data', function (chunk) {
            postsdata += chunk;
        });
        resp.on('end', function () {
            pushCommentsData(postsdata);
        });
    }).on("error", function (err) {
        console.log("Error: " + err.message);
    });
}
function pushCommentsData(postdata) {
    var commentsdata = '';
    https.get('https://jsonplaceholder.typicode.com/comments', function (resp) {
        resp.on('data', function (chunk) {
            commentsdata += chunk;
        });
        resp.on('end', function () {
            db_1.saveAll("posts", constructPostData(postdata, commentsdata));
        });
    }).on("error", function (err) {
        console.log("Error: " + err.message);
    });
}
function constructPostData(postdata, commentsdata) {
    var i = 0, j;
    var posts = JSON.parse(postdata);
    var com = JSON.parse(commentsdata);
    for (i = 0; i < posts.length; i++) {
        var comments = [];
        for (j = 0; j < com.length; j++) {
            if (posts[i]["id"] == com[j]["postId"]) {
                comments.push(com[j]);
            }
        }
        posts[i]['comments'] = comments;
        i++;
    }
    return posts;
}
app.post('/setup', function (req, res) {
    db_1.createDB();
    db_1.createCollection("users");
    db_1.createCollection("posts");
    db_1.truncateCollection("users");
    db_1.truncateCollection("posts");
    pushUserData();
    pushPostsData();
    res.send("{\"Response\" : 200,\"message\":\"datasets pushed to the mongodb successfully\"}");
});
app.get('/user', function (req, res) {
    var userid = req.query.userid;
    var response = "";
    if (!userid) {
        db_1.getAllUsers(res);
    }
    else {
        db_1.getUser(userid, res);
    }
});
app.put('/user', function (req, res) {
    console.log(req.body);
    var userid = req.body.userid;
    var response = "";
    db_1.updateUser(req.body.userid, req.body.field, req.body.newvalue, res);
});
app.get('/userspost', function (req, res) {
    db_1.getAllUsersWithPost(req.query.userid, res);
});
app.get('/', function (req, res) {
    res.send('Hello HopeResearch!');
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
