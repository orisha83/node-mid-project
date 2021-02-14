let jfile = require('jsonfile');
let session = require('../context/session')


const checkIfUserIsInFile = function(user, pass)
{
    return new Promise((resolve,reject) =>
    {
        jfile.readFile(__dirname + "/users.json", function(err,data)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                let usersArr = data.users;
                let returnedUser = usersArr.find(x => x.userName == user && x.password == pass)
                if(returnedUser)
                {
                    resolve(returnedUser)
                }
                else
                {
                    resolve("")
                }
            }
        })
    })
}

const getAllUsers = function()
{
    return new Promise((resolve,reject) =>
    {
        jfile.readFile(__dirname + "/users.json", function(err,data)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                let usersArr = data.users;
                resolve(usersArr)
            }
        })
    })
}

const writeToFile = function(obj)
{
    return new Promise((resolve,reject) =>
    {
        jfile.writeFile(__dirname + "/users.json", obj, function(err)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve('OK')
            }
        })
    });
}


module.exports  =  {checkIfUserIsInFile, getAllUsers, writeToFile}