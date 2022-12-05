var http = require('http');
var fs = require('fs');
var qs = require("querystring");
const { listeners } = require('process');
const mongoose = require('mongoose');
const path = require('path');
var adr = require('url');
const express = require("express");

//Create Mongoose schema object
const equities = new mongoose.Schema(
    {
      Company_Name: String,
      Ticker: String
    }
);

const Equity = mongoose.model('Equity', equities);

//Connect to localhost to open a new page when index.html form is submitted
http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type':'text/html'});
        u = adr.parse(req.url, true)
        //Choose the pathname 
        if (u.pathname == "/process")
        {
            //Get user input from the index.html form
            var user_input = u.query.user_input;
            var user_radio = u.query.btn;

            //Connect to MongoDB
            const url ="mongodb+srv://joannapguerra:cs201234@clustercs20.vsjagy1.mongodb.net/Stock_ticker"; 
            mongoose.connect(url);
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'error:'));
            //Once the DB is connected, open it and find the data that corresponds to the user request
            //Show error message if user input does not match to the data available in the database 
            db.once('open', function() {
                //If user inputs Company name and wants to know Stock name
                if (user_radio == "cname") {
                    Equity.find({Company_Name: user_input}, function (err, docs) {
                        if (err){
                            res.write(err);
                        }
                        else{
                            if (docs.length === 0){
                                res.write("Sorry! Try another ticker or company.");
                                res.end();
                            } else {
                                res.write(JSON.stringify(docs));
                                res.end();
                            };
                        };
                    });
                //If user inputs Stock name and wants to know Company name
                } else {
                    Equity.find({Ticker: user_input}, function (err, docs) {
                        if (err){
                            console.log(err);
                        }
                        else{
                            if (docs.length === 0){
                                res.write("Sorry! Try another ticker or company.");
                                res.end();
                            } else {
                                res.write(JSON.stringify(docs));
                                res.end();
                            };
                        };
                    });
                };
            });
        //If the patchname chosen does not lead to the page where data was inserted, show error messase
        } else {
            res.write ("Unknown page request");
        };

}).listen(8080);




