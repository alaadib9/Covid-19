'use strict';
// including - importing libraries
const express = require('express');
const superAgent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const methodOverride = require('method-override');

// setup and configuration
require('dotenv').config();
const app = express();
app.use(cors());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// const client = new pg.Client(process.env.DATABASE_URL);   // on your machine
let PORT = process.env.PORT || 3000;
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); // for heroku



/***************************************************************************************************************************** */
app.get('/', handelHome);
app.post('getCountryResult', handelResult);
app.get('/summary', handelSummary);
app.get('/record', handelRecords);
app.delete('/delete/:id', handelDelete);
app.post('/summary', addHandler);
app.get('/details/:id', showDetails)


/***************************************************************************************************************************** */
function addHandler(req, res) {
    let favQuery = 'INSERT INTO covidtable (country,totalConfirmedCases,TotalDeathsCases, TotalRecoveredCases , date) VALUES($1,$2,$3,$4,$5) WHERE id=$6';
    client.query(favQuery).then(element => {
        res.redirect('/myRecord')
    }).catch(error => {
        res.send('AN ERROR IN ADD' + error)
    })

}

function showDetails(req, res) {

    let id = req.params.id

    let query = 'SELECT * FROM covidtable WHERE id=$1';
    client.query(query).then(data => {

        res.render('recordDetails', { data: data.rows[0] })
    })
}





function handelDelete(req, res) {
    let value = req.params.id
    let query = 'DELETE * covidtable  FROM WHERE id=$1';
    client.query(query, value).then(() => {
        res.redirect('/')
    }).catch(error => {
        res.send('ERROR IN DELETE HANDLER' + error)
    })
}

function handelHome(req, res) {
    let renderHome = data.body;
    let url = 'https://api.covid19api.com/world/total'
    superAgent.get(url).then(data => {
        res.render('index', { data: renderHome })
    })
}

function handelResult(req, res) {
    res.redirect('/getCoubtryResult')
}

function handelSummary(req, res) {
    let dataReq = data.body;
    let url = 'https://api.covid19api.com/summary'
    superAgent.get(url).then(data => {
        let id = req.params.id;
        return new Covid(country, totalConfirmedCases, TotalDeathsCases, TotalRecoveredCases, date)
    })
    res.render('All Countries/id', { data: dataReq })

}

function handelRecords(req, res) {
    let renderData = req.body
    let selectQuery = 'SELECT * FROM covidtable;'
    let safeValus = [renderData.TotalRecoveredCases]
    client.query(selectQuery, safeValus).then(data => {
        res.render('/myRecord', { data: data.row[0] })
    });
}


function Covid(country, totalConfirmedCases, TotalDeathsCases, TotalRecoveredCases, date) {
    this.country = country;
    this.totalConfirmedCases = totalConfirmedCases;
    this.TotalDeathsCases = TotalDeathsCases;
    this.TotalRecoveredCases = TotalRecoveredCases;
    this.data = date;
}


client.connect().then(() => {
    app.listen(PORT, () => console.log('YOUR APP IS WORKING IN PORT ' + PORT))
}).catch(error => console.log('THERE IS AN ERROR IN LISTENING' + error))