const express = require("express");
let router = express.Router();

require("dotenv").config();
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { filter } = require("compression");

const articleObjects = require("./helpers/articleObjects");

// retrieve by search term //
router.get("/", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    const query = req.query.q;
    // using config to hide keys
    const gaurdianKeyword = `https://content.guardianapis.com/search?q=${query}&show-fields=thumbnail&page-size=50&api-key=${process.env.GAURDIAN_API_KEY}`;
    const nytKeyword = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&page=1
			&api-key=${process.env.NYT_API_KEY}`;
    //const newsApi = `https://newsapi.org/v2/everything?q=Biden&pageSize=40&apiKey=b05a05005ec84712a23fe01b017a443b
    //}`;
    // call apis
    const gaurdianReq = await axios.get(gaurdianKeyword);

    const nytKeywordReq = await axios.get(nytKeyword);
    //const newsApiReq = await axios.get(newsApi);

    //   // filter out metadata
    const gaurdianResults = gaurdianReq.data.response.results;
    const nytResults = nytKeywordReq.data.response.docs;
    //const newsApiResults = newsApiReq.data.articles;
    const allArticles = articleObjects(
      gaurdianResults,
      //newsApiResults,
      nytResults
    );
    // randomize results with Fischer-Yates algorithm
    const randomResults = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    };

    // get rid of duplicates
    const unique = [...new Set(allArticles)];
    res.status(200).send(randomResults(unique));
  } catch (err) {
    console.log("SEARCH ERROR", err);
    res.json({ msg: "No Results" });
  }
});

module.exports = router;
