var express = require('express');
var router = express.Router();
let session = require('../context/session')
let usersBL = require('../Models/UsersBL')

/* GET home page. */
router.get('/', async function(req, res, next) {
  let errorMsg = false
  if(req.session.error == 2)
  {
    let today = new Date().toISOString().slice(0, 10)

    errorMsg = "No Transactions left for User for Today"
    userObj = {id : req.session.logedInUser.id, 
               userName : req.session.logedInUser.userName, 
               password : req.session.logedInUser.password, 
               type : req.session.logedInUsertype, 
               createdDate : req.session.logedInUser.createdDate, 
               numOfTransactions : req.session.logedInUser.numOfTransactions,
               lastLoginDate : today,
               transactionsLeft : 0 }
    let res = await usersBL.updateUserById(req.session.logedInUser.id, userObj)
  } 
  else if(req.session.error == 1)
  {
    errorMsg = "User Or Password are not correct"
  }                    
    req.session.destroy()
  
  res.render('login', { msg : errorMsg });
});

router.get('/main', function(req, res, next) {

  if(session.isAuthenticated(req))
  {
      let isAdmin = session.isUserAnAdmin()
      res.render('main', { isUserAnAdmin : isAdmin });
  }
  else
  {
    res.redirect('/login')
  }
});


router.post('/login/getdata', async function(req, res, next) {
  
    let username = req.body.username;
    let pwd = req.body.pwd;

    if(username != "" && pwd != "")
    {
      let user = await usersBL.verifyUser(username, pwd)
      if(user != "") //varified
      {
        session.saveContextUserInfo(req,user)
        
        if(user.type == "ADMIN" || usersBL.hasEnoughTransactionLeft(user) )
        {
          res.redirect('/main')
        }
        else
        {
          res.render('login', {msg : "No Transactions left for User for Today" });
        }
      }
      else //Not varified
      {
        req.session.error = 1;
        res.redirect('/login')
      }   
    }
    else
    {
      req.session.error = 1;
      res.redirect('/login')
    }
  });

module.exports = router;