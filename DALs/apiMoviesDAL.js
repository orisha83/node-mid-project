let axios = require('axios')

const getMovies = function()
{
    return axios.get("https://api.tvmaze.com/shows");
}

const getMovieById = function(id)
{
    return axios.get("https://api.tvmaze.com/shows/" + id);
}

module.exports  =  {getMovies, getMovieById }