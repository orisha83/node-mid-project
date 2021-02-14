var session = require('express-session');

let sess;

const isAuthenticated = function (input)
{    
    sess = input.session
    if(sess.authenticated)
    {   
        return true
    }
    else
    {
        return false
    }
}

const updateNumOfTrxForUser = function(input)
{
    sess = input.session
    sess.userNumOfTransactions = sess.userNumOfTransactions - 1
}

const getCurrentNumberOfTransactionsLeft = function(input)
{
    sess = input.session
    if(sess.isAdmin)
    {
        return 1
    }
    else
    {
        return sess.userNumOfTransactions
    }
    
}

const saveContextUserInfo = function(input, user)
{
    if(!(sess === input.session))
    {
        sess = input.session
        sess.logedInUser = user
        if(user.type == 'ADMIN')
        {
            sess.isAdmin = true
        }
        else
        {
            sess.isAdmin = false
        }

        sess.authenticated = true;
        sess.userNumOfTransactions = user.numOfTransactions
    }
}

const isUserAnAdmin = function()
{
    return sess.isAdmin
}

module.exports  =  {isAuthenticated, saveContextUserInfo, isUserAnAdmin, getCurrentNumberOfTransactionsLeft, updateNumOfTrxForUser}