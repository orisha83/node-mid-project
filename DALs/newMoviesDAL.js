let jfile = require('jsonfile')

const writeToFile = function(obj)
{
    return new Promise((resolve,reject) =>
    {
        jfile.writeFile(__dirname + "/newMovies.json", obj, function(err)
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

const readMoviesFile = function()
{
    return new Promise((resolve,reject) =>
    {
        jfile.readFile(__dirname + "/newMovies.json", function(err,data)
        {
            if(err)
            {
                reject(err);
            }
            else
            {
                let moviesArr = data.movies;
                resolve(moviesArr)
            }
        })
    })
   
}


module.exports  =  {writeToFile, readMoviesFile }