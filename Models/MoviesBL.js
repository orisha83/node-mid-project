let apiMovies = require('../DALs/apiMoviesDAL')
let newMovies = require('../DALs/newMoviesDAL')


const getMoviesData = async function()
{
    let response = await apiMovies.getMovies()
    let moviesData = response.data
    return moviesData
}

const writeToFile = async function(moviesArray)
{
    try
    {
        let obj = {movies : moviesArray}    
        let result = await newMovies.writeToFile(obj);
        return result
    }
    catch(err)
    {
        return(err)
    }
}

const getAllGenres = async function()
{
    allApiMovies = await getMoviesData()
    allGenresTypes = []
    allApiMoviesGenresArry = allApiMovies.map(x => x.genres)
    allApiMoviesGenresArry.forEach(array => {
        array.forEach(item => {
            if(!allGenresTypes.includes(item))
            {
                allGenresTypes.push(item)
            }
        })
    })

    allFileMovies = await newMovies.readMoviesFile()
    allFileMoviesGenresArry = allFileMovies.map(x => x.genres)
    allFileMoviesGenresArry.forEach(array => {
        array.forEach(item => {
            if(!allGenresTypes.includes(item))
            {
                allGenresTypes.push(item)
            }
        })
    })
    

    return allGenresTypes    
}

const getAllLanguages = async function()
{
    allApiMovies = await getMoviesData()
    allLanguagesTypes = []
    allApiMoviesLanguage = allApiMovies.map(x => x.language)
    allApiMoviesLanguage.forEach(item => {
        if(!allLanguagesTypes.includes(item))
        {
            allLanguagesTypes.push(item)
        }
    })

    allFileMovies = await newMovies.readMoviesFile()
    allFileMoviesLanguage = allFileMovies.map(x => x.language)
    allFileMoviesLanguage.forEach(item => {
        if(!allLanguagesTypes.includes(item))
        {
            allLanguagesTypes.push(item)
        }
    })    

    return allLanguagesTypes
}

const getMovieSearchResults = async function(movieName, movieGenre, movieLanguage)
{
    let allApiMovies = await getMoviesData()
    let foundMovies = []
    let returnedObj = {}
    allshapedApiMovies = allApiMovies.map((item,index) => 
    {
        return {movieName : item.name, movieGenres : item.genres, movieLanguage : item.language, movieId : item.id}
    })
    if(movieName != "")
    {
        allshapedApiMovies = allshapedApiMovies.filter(x => x.movieName.toUpperCase().startsWith(movieName.toUpperCase()))
    }
    if(movieGenre != "")
    {
        allshapedApiMovies = allshapedApiMovies.filter(x => x.movieGenres.includes(movieGenre))
    }
    if(movieLanguage != "")
    {
        allshapedApiMovies = allshapedApiMovies.filter(x => x.movieLanguage == movieLanguage)
    }

    foundMovies = allshapedApiMovies
    

    allFileMovies = await newMovies.readMoviesFile()
    allShapedFileMovies = allFileMovies.map((item,index) => 
    {
        return {movieName : item.name, movieGenres : item.genres, movieLanguage : item.language, movieId : item.id}
    })
    if(movieName != "")
    {
        allShapedFileMovies = allShapedFileMovies.filter(x => x.movieName.toUpperCase().startsWith(movieName.toUpperCase()))
    }
    if(movieGenre != "")
    {
        allShapedFileMovies = allShapedFileMovies.filter(x => x.movieGenres.includes(movieGenre))
    }
    if(movieLanguage != "")
    {
        allShapedFileMovies = allShapedFileMovies.filter(x => x.movieLanguage == movieLanguage)
    }

    allShapedFileMovies.forEach(x => foundMovies.push(x))

    foundMovies.forEach(movieObj => {
        let filteredApiMovies = allApiMovies.filter(x => x.name != movieObj.movieName && x.genres.includes(movieObj.movieGenres[0]))
        let reducedFilteredApiMovies = filteredApiMovies.slice(0,3)
        movieObj.sameGenreMoviesArray = reducedFilteredApiMovies
    })

    return foundMovies
}

const getMovieById = async function(id)
{
    let allApiMovies = await getMoviesData()
    let movieData = allApiMovies.find(x => x.id == id)
    if(movieData)
    {
        return movieData
    }
    else
    {
        allFileMovies = await newMovies.readMoviesFile()
        movieData = allFileMovies.find(x => x.id == id)
        return movieData
    }
}

const getNextId = async function()
{
    let nextId = 0
    allFileMovies = await newMovies.readMoviesFile()
    if(allFileMovies.length > 0)
    {
        nextId = Math.max.apply(Math, allFileMovies.map(function(o) {
           return o.id})) + 1
    }
    else
    {
        allApiMovies = await getMoviesData()
        nextId = Math.max.apply(Math, allApiMovies.map(function(o) {
            return o.id})) + 1
    }
    return nextId
}

const writeNewMovieToMoviesFile = async function(movieObj)
{
    let allFileMovies = []
    allFileMovies = await newMovies.readMoviesFile()
    allFileMovies.push(movieObj)
    newMoviesObj = {movies : allFileMovies}
    let response = await newMovies.writeToFile(newMoviesObj)
    return response
}

const saveNewMovieInFile = async function(iName, iGenres, iLanguage)
{

    nextId = await getNextId()
    let newMovie = {id : nextId, name : iName, language : iLanguage, genres : iGenres}
    let response = await writeNewMovieToMoviesFile(newMovie)
    return response
}

module.exports  =  {getMoviesData, writeToFile, getAllGenres, getAllLanguages, getMovieSearchResults, getMovieById, saveNewMovieInFile, getNextId}