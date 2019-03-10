"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/master";
function createDB() {
    MongoClient.connect(url + "master", function (err, db) {
        if (err)
            throw err;
        console.log("Database created!");
        db.close();
    });
}
exports.createDB = createDB;
function createCollection(name) {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("master");
        dbo.createCollection(name, function (err, res) {
            if (err)
                throw err;
            console.log("Collection created!");
            db.close();
        });
    });
}
exports.createCollection = createCollection;
function saveAll(collectionName, data) {
    MongoClient.connect(url, function (err, db) {
        console.log(data);
        if (err)
            throw err;
        var dbo = db.db("master");
        dbo.collection(collectionName).insertMany(data, function (err, res) {
            if (err)
                throw err;
            console.log("all data inserted");
            db.close();
        });
    });
}
exports.saveAll = saveAll;
function truncateCollection(name) {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var myquery = {};
        var dbo = db.db("master");
        dbo.collection(name).remove(myquery, function (err, obj) {
            if (err)
                throw err;
            console.log(obj.result.n + " document(s) deleted");
            db.close();
        });
    });
}
exports.truncateCollection = truncateCollection;
function updateUser(userid, field, value, response) {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("master");
        dbo.collection("users").updateOne({ "id": parseInt(userid) }, { $set: JSON.parse("{\"" + field + "\":\"" + value + "\"}") }, function (err, result) {
            if (err)
                throw err;
            db.close();
            response.send(result);
        });
    });
}
exports.updateUser = updateUser;
function getUser(userid, response) {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("master");
        dbo.collection("users").findOne({ 'id': parseInt(userid) }, function (err, result) {
            if (err)
                throw err;
            db.close();
            response.send(result);
        });
    });
}
exports.getUser = getUser;
function getAllUsers(response) {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("master");
        dbo.collection("users").find({}).toArray(function (err, result) {
            if (err)
                throw err;
            db.close();
            response.send(result);
        });
    });
}
exports.getAllUsers = getAllUsers;
function getAllUsersWithPost(userid, response) {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("master");
        dbo.collection('users').aggregate([
            { $lookup: {
                    from: 'posts',
                    localField: 'id',
                    foreignField: 'userId',
                    as: 'posts'
                }
            },
            {
                $match: {
                    $and: [
                        {
                            "id": parseInt(userid)
                        }
                    ]
                }
            }
        ]).toArray(function (err, res) {
            if (err)
                throw err;
            db.close();
            response.send(res);
        });
    });
}
exports.getAllUsersWithPost = getAllUsersWithPost;
