let usersDAL = require('../DALs/usersDAL')


const verifyUser = async function(userName, pass)
{
    let user = await usersDAL.checkIfUserIsInFile(userName, pass)
    if(user != "")
    {
        return user
    }
    else
    {
        return ""
    }
}

const getAllUsers = async function()
{
    users = await usersDAL.getAllUsers()
    return users
}

const getUserById = async function(id)
{
    users = await usersDAL.getAllUsers()
    let user = users.find(x => x.id == id)
    return user
}

const writeNewUserToFile = async function(userName, password, userType, createdDate, numberOfTransactions)
{
    let users = []
    users = await usersDAL.getAllUsers()
    nextId = Math.max.apply(Math, users.map(function(o) {
        return o.id})) + 1

    newUserObject = {id :nextId, userName : userName, password : password, createdDate : createdDate, numOfTransactions : numberOfTransactions, type : userType }  
    users.push(newUserObject)   
    
    usersObject = {users : users}
    let resonse = await usersDAL.writeToFile(usersObject)
    return resonse
}

const deleteUserById = async function(id)
{
    let allUsers = await usersDAL.getAllUsers()
    let users = allUsers.filter(x => x.id != id)

    usersObject = {users : users}
    let resonse = await usersDAL.writeToFile(usersObject)
    return resonse
}

const updateUserById = async function(userId, Obj)
{
    let allUsers = await usersDAL.getAllUsers()
    let userIndex = allUsers.findIndex(x => x.id == userId)

    allUsers[userIndex] = Obj  
    usersObject = {users : allUsers}
    let resonse = await usersDAL.writeToFile(usersObject)
    return resonse
}

const hasEnoughTransactionLeft = function(user)
{
    returnValue = false
    if(user.numOfTransactions > 0)
    {
        if(!user.hasOwnProperty('transactionsLeft'))
        {
            returnValue = true
        }
        else 
        {
            if(user.transactionsLeft > 0)
            {
                returnValue = true
            }
            else
            {
                let sysdate = new Date().toISOString().slice(0, 10)
                if(user.lastLoginDate != sysdate)
                {
                    returnValue = true
                }
                else
                {
                    returnValue = false
                }
            }
        }    
    }
    else
    {
        returnValue = false
    }

    return returnValue
}

module.exports  =  {verifyUser, getAllUsers, getUserById, writeNewUserToFile, deleteUserById, updateUserById, hasEnoughTransactionLeft}