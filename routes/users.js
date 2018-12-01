var express = require('express');
var router = express.Router();
let userApi = require('../apiController/userProfile');
let util = require('../util.json');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signUp',function(req,res,next){
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  userApi.signUp(req.body,function(err,response){
    if(err) {
      res.send(err);
      return
    }
    res.send(response);
  })
});

router.post('/login',function(req,res,next){
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  userApi.login(req.body,function(err,response){
    if(err) {
      res.send(err);
      return
    }
    res.send(response);
  })
});

router.post('/search',function(req,res,next){
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  userApi.searchUser(req.body,function(err,response){
    if(err) {
      res.send(err);
      return
    }
    res.send(response);
  })
});

module.exports = router;
