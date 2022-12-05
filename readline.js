var Connect_HTTP = require('http');
var readline = require('readline');
var fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const { listeners } = require('process');
const connStr = "mongodb+srv://joannapguerra:cs201234@clustercs20.vsjagy1.mongodb.net/myFirstDatabase";

//Connection to MongoDB
MongoClient.connect(connStr, {useUnifiedTopology: true },  function(err, db) {
  if(err) { 
    return console.log(err); 
    } else {
	console.log("Success connection!");
    };

  //Call function that will input csv doc into mongo database
  DB_import(db);
 
});

function DB_import(database){
  //Choose database and collection on MongoDB where data will be inputted
  var mydb = database.db('Stock_ticker');
  var mycollection = mydb.collection('equities');
  
  //Open csv file and read each line at a time
  var myFile = readline.createInterface({
    input: fs.createReadStream('/Users/joannaguerra/Desktop/companies.csv')
  });

  myFile.on('line', function (line) {

    var Arr_all = [];
    var allTextLines = line.split(/\r\n|\n/);
    //Separate each line in two parts (company name and stock ticker)
    var entries = allTextLines[0].split(',');
    //Concat the data from the line with their respective labels
    var enter_arr = { 'Company_Name': entries[0], 'Ticker': entries[1]};
    //Push data into an array
    Arr_all.push(enter_arr);

    //Insert array in MongoDB collection and show message of success in case everything works
    mycollection.insertMany(Arr_all, (err, res) => {
      if (err) throw err;
      console.log('Success insert!');
    });
    
  });

  //Show message of error
  myFile.on('error', function() {
    console.log('Error DB_import function');
  });

};




