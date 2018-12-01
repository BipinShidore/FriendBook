var express = require('express');
var router = express.Router();
let userApi = require('../apiController/userProfile');
let friendApi = require('../apiController/friendContoller');
let util = require('../util.json');

router.post('/sendFriendRequest',function(req,res,next){
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    friendApi.sendFriendRequest(req.body,function(err,response){
      if(err) {
        res.send(err);
        return
      }
      res.send(response);
    })
  });

  router.post('/acceptFriendRequest',function(req,res,next){
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    friendApi.acceptFriendRequest(req.body,function(err,response){
      if(err) {
        res.send(err);
        return
      }
      res.send(response);
    })
  });

  router.post('/unfriend',function(req,res,next){
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    friendApi.removeFriends(req.body,function(err,response){
      if(err) {
        res.send(err);
        return
      }
      res.send(response);
    })
  });

module.exports = router;
