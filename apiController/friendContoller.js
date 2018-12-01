let util = require('../util.json');
let ObjectID = require('mongodb').ObjectID;

let self = module.exports = {

    sendFriendRequest: function (params, callback) {

        if (params.friendId === undefined || params.friendId === "") {
            callback(util.responseMessages.parameterMissing);
            return;
        }

        if(params.userId === params.friendId) {
            callback(util.responseMessages.invalidFriendId);
            return;
        }

        const userCollection = db.collection(util.dbCollectionName.users);

        userCollection.update({ "_id": new ObjectID(params.userId) }, { '$addToSet': { sentFriendRequest: params.friendId } },function (err, requestSent) {
            if (err) {
                callback(util.responseMessages.databaseError);
                return;
            }
            userCollection.update({ "_id": new ObjectID(params.friendId) }, { '$addToSet': { receivedFriendRequest: params.userId } },function (err, result) {
                if (err) {
                    callback(util.responseMessages.databaseError);
                    return;
                }
                callback(null, util.responseMessages.friendAddedSuccessfully);
            })
        })
    },

    acceptFriendRequest : function(params,callback) {
        if (params.friendId === undefined || params.friendId === "") {
            callback(util.responseMessages.parameterMissing);
            return;
        }

        if(params.userId === params.friendId) {
            callback(util.responseMessages.invalidFriendId);
            return;
        }

        const userCollection = db.collection(util.dbCollectionName.users);

        userCollection.update({ "_id": new ObjectID(params.userId) }, { '$addToSet': { friendList: params.friendId },'$pull' : {sentFriendRequest: params.friendId} },function (err, requestAccepted) {
            if (err) {
                callback(util.responseMessages.databaseError);
                return;
            }
            userCollection.update({ "_id": new ObjectID(params.friendId) }, { '$addToSet': { friendList: params.userId},'$pull' : {receivedFriendRequest: params.userId} },function (err, result) {
                if (err) {
                    callback(util.responseMessages.databaseError);
                    return;
                }
                callback(null, util.responseMessages.friendRequestAccepted);
            })
        })
    },

    removeFriends : function(params,callback) {

        if (params.friendId === undefined || params.friendId === "") {
            callback(util.responseMessages.parameterMissing);
            return;
        }

        if(params.userId === params.friendId) {
            callback(util.responseMessages.invalidFriendId);
            return;
        }

        const userCollection = db.collection(util.dbCollectionName.users);

        userCollection.update({ "_id": new ObjectID(params.userId) }, { '$pull' : {friendList: params.friendId} },function (err, friendRemoved) {
            if (err) {
                callback(util.responseMessages.databaseError);
                return;
            }
            userCollection.update({ "_id": new ObjectID(params.friendId) }, { '$pull' : {friendList: params.userId} },function (err, result) {
                if (err) {
                    callback(util.responseMessages.databaseError);
                    return;
                }
                callback(null, util.responseMessages.friendRemovedSuccessfully);
            })
        })
    }
}