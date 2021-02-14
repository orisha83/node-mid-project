var express = require('express');
var router = express.Router();
let session = require('../context/session')
let usersBL = require('../Models/UsersBL')


/* GET users listing. */
router.get('/', async function(req, res, next) {
  if(session.isAuthenticated(req))
  {
      let users = await usersBL.getAllUsers()
      res.render('usersManagment', { allUsers : users});
  }
  else
  {
      res.redirect('/login')
  }
});

router.get('/delete/:id', async function(req, res, next) {
  if(session.isAuthenticated(req))
  {
      let response = await usersBL.deleteUserById(req.params.id)
      if(response == "OK")
      {
        res.redirect('/main')
      }
  }
  else
  {
      res.redirect('/login')
  }
});

router.get('/update/:id', async function(req, res, next) {
  if(session.isAuthenticated(req))
  {
      let user = await usersBL.getUserById(req.params.id)
      res.render('userData', { foundUser : user, action : "update"});
  }
  else
  {
      res.redirect('/login')
  }
});

router.get('/userData', function(req, res, next) {
  if(session.isAuthenticated(req))
  {
      res.render('userData', {foundUser : false, action : "create" });
  }
  else
  {
      res.redirect('/login')
  }
});


router.post('/getUserData/create', async function(req, res, next) {
  if(session.isAuthenticated(req))
  {
      let userName = req.body.userName
      let password = req.body.password
      let userType = req.body.userType
      let createdDate = req.body.createdDate
      let numberOfTransactions = req.body.numberOfTransactions
     
      let response = await usersBL.writeNewUserToFile(userName, password, userType, createdDate, numberOfTransactions)

      if(response == "OK")
      {
        res.redirect('/main')
      }
  }
  else
  {
      res.redirect('/login')
  }
});

router.post('/getUserData/update', async function(req, res, next) {
  if(session.isAuthenticated(req))
  {
      let userId = req.body.userId
      let userName = req.body.userName
      let password = req.body.password
      let userType = req.body.userType
      let createdDate = req.body.createdDate
      let numberOfTransactions = req.body.numberOfTransactions

      userObj = {id : userId, userName: userName, password: password, createdDate: createdDate, numOfTransactions: numberOfTransactions, type : userType}
     
      let response = await usersBL.updateUserById(userId, userObj)

      if(response == "OK")
      {
        res.redirect('/main')
      }
  }
  else
  {
      res.redirect('/login')
  }
});


module.exports = router;
