var express = require('express');
var router = express.Router();
let session = require('../context/session')
let moviesBL = require('../Models/MoviesBL')

router.get('/searchMovies', async function(req, res, next) {

    if(session.isAuthenticated(req))
    {
        let allGenres = await moviesBL.getAllGenres()
        let allLanguages = await moviesBL.getAllLanguages()
        res.render('searchMovies', { allMoviesGenres : allGenres, allMoviesLanguages : allLanguages});
    }
    else
    {
        res.redirect('/login')
    }
});

router.get('/createMovie', function(req, res, next) {

    if(session.isAuthenticated(req))
    {
        let curNumberOfTrxForUser = session.getCurrentNumberOfTransactionsLeft(req)
        if(curNumberOfTrxForUser > 0)
        {
            session.updateNumOfTrxForUser(req)
            res.render('createMovie', { });
        }
        else
        {
            req.session.error = 2;
            res.redirect('/login')
        }

    }
    else
    {
        res.redirect('/login')
    }
});

router.post('/searchMovies/getSearchData', async function(req, res, next) {

    if(session.isAuthenticated(req))
    {
        let curNumberOfTrxForUser = session.getCurrentNumberOfTransactionsLeft(req)
        if(curNumberOfTrxForUser > 0)
        {
            session.updateNumOfTrxForUser(req)
            let movieName = req.body.movieName
            let movieGenre = req.body.genres
            let movieLanguage = req.body.languages

            let movieList = await moviesBL.getMovieSearchResults(movieName, movieGenre, movieLanguage)
        
            res.render('searchResults', { foundMovies : movieList});
        }
        else
        {
            req.session.error = 2;
            res.redirect('/login')
        }
    }
    else
    {
        res.redirect('/login')
    }
});

router.post('/createMovie/getCreateData', async function(req, res, next) {

    if(session.isAuthenticated(req))
    {
        let movieName = req.body.movieName
        let movieGenres = req.body.movieGenres.split(" ")
        let movieLanguage = req.body.movieLanguage

        if(movieName != "" && movieGenres != "" && movieLanguage != "")
        {
            let result = await moviesBL.saveNewMovieInFile(movieName, movieGenres, movieLanguage)
            if(result == "OK")
            {
                res.redirect('/main')
            }
        }
              
        res.redirect('/main')
    }
    else
    {
        res.redirect('/login')
    }
});


router.get('/:id', async function(req, res, next) {

    if(session.isAuthenticated(req))
    {
        let curNumberOfTrxForUser = session.getCurrentNumberOfTransactionsLeft(req)
        if(curNumberOfTrxForUser > 0)
        {
            session.updateNumOfTrxForUser(req)

            let movieId = req.params.id
            let foundMovie = await moviesBL.getMovieById(movieId)

            res.render('movie', {movie : foundMovie });
        }
        else
        {
            req.session.error = 2;
            res.redirect('/login')
        }
    }
    else
    {
        res.redirect('/login')
    }
});


module.exports = router;