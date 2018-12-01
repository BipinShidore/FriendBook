let util = require('../util.json');
let ObjectID = require('mongodb').ObjectID;

let self = module.exports = {

    signUp : function (params,callback){
        
        let requiredParams = ["email","password","userName"];
        let validateParams = self.checkRequiredParams(params,requiredParams)

        if (!validateParams) {
           callback(util.responseMessages.parameterMissing);
            return;
        }
        const userCollection = db.collection(util.dbCollectionName.users);

        self.checkIfUserExists(params, function (err, userExistsResponse) {
            if (err) {
                if (err.email == params.email) {
                    callback(util.responseMessages.emailIdExists);
                    return;
                }
                else if (err.userName == params.userName) {
                    callback(util.responseMessages.userNameAlreadyExists);
                    return;
                }
            }
            params.friendList = [];
            params.receivedFriendRequest = [];
            params.sentFriendRequest = [];
            params.removedFriends = [];
            userCollection.insertOne(params, function (err, result) {
                if (err) {
                    callback(util.responseMessages.databaseError);
                    return;
                }
                callback(null,util.responseMessages.userCreatedSuccessfully);
            });
        }) 
    },

    checkRequiredParams : function(data,requiredParams) {
        if(data === ""){
            return;
        }
        let validParams = true;
        for(let i = 0; i < requiredParams.length; i++) {
            if(data[requiredParams[i]] === undefined || data[requiredParams[i]] === "") {
                validParams = false;
            }
        }
        return validParams;
    },

    checkIfUserExists: function (reqBody, callback) {
        const userCollection = db.collection(util.dbCollectionName.users);
        const emailFilter = {
            email: reqBody.email
        };
        const userNameFilter = {
            userName: reqBody.userName
        };
        userCollection.findOne(emailFilter, function (err, result) {
            if (err) {
                callback(util.responseMessages.databaseError);
                return;
            }
            if (result == null || result == '') {
                userCollection.findOne(userNameFilter, function (err, userNameResult) {
                    if (err) {
                        callback(util.responseMessages.databaseError);
                        return;
                    }
                    if (userNameResult == null || userNameResult == '') {
                        callback(null, 'success');
                    }
                    else {
                        callback(userNameResult);
                    }
                });
            }
            else {
                callback(result);
                return;
            }
        });
    },

    login: function (params,callback) {

        let requiredParams = ["email","password"];
        let validateParams = self.checkRequiredParams(params,requiredParams)

        if (!validateParams) {
           callback(util.responseMessages.parameterMissing);
            return;
        }

        const userCollection = db.collection(util.dbCollectionName.users);
        const userActivities = db.collection(util.dbCollectionName.userActivities);
        userCollection.findOne(params, function (err, result) {
            if (err) {
                callback(util.responseMessages.databaseError);
                return;
            }

            if (result == null || result == '') {
                callback(util.responseMessages.invalidCredentials);
            }
            else {
                var userActivity = {
                    userId: result._id.toString(),
                    date: new Date(),
                    isoDate: new Date().toISOString(),
                    activity: 'login'
                };
                userActivities.insertOne(userActivity, function (err, activityInserted) {
                    if (err) {
                        callback(util.responseMessages.databaseError);
                        return;
                    }
                    result["userId"] = result["_id"];
                    delete result["password"];
                    delete result["_id"];
                    var resultArr = [];
                    resultArr.push(result);
                    util.responseMessages.loginSuccessfull.data = resultArr;
                    callback(null,util.responseMessages.loginSuccessfull);
                });
            }
        });
    },

    searchUser : function(params,callback) {

        const userCollection = db.collection(util.dbCollectionName.users);
        let pattern = new RegExp(params.searchText, "i");
        let query = {"userName":pattern};

        userCollection.find(query).toArray(function (err, result) {
            if (err) {
                callback(util.responseMessages.databaseError);
                return;
            }
            if(result.length === 0){
                callback(null,{...util.responseMessages.searchResult,"message" : "No Users Found"})
            }
            else {
                callback(null,{...util.responseMessages.searchResult,"result":result})
            }
        })
    }
}