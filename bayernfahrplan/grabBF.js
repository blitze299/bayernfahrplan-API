var request = require('request');
var http = require('http');
var date = require('date-and-time');
var concat = require('concat');
var cheerio = require('cheerio');
var fs = require('fs');
var dataInTable;

//config variables:
var haltestelle = 'Djk Sportzentrum'


//date + time
var date = new Date();

var year = date.getFullYear();
var month = date.getMonth() + 1;
var day  = date.getDate();
var hour = date.getHours();
var min  = date.getMinutes();

//complete date for Bayernfahrplan form:
var dateFull = (year+''+month+''+day);


// Values needed for Bayernfahrplan POST form
var formData = {
  locationServerActive: 1,
  convertAddressesITKernel2LocationServer: 1,
  convertCoord2LocationServer: 1,
  convertCrossingsITKernel2LocationServer: 1,
  convertPOIsITKernel2LocationServer: 1,
  convertStopsPTKernel2LocationServer: 1,
  ptOptionsActive: 1,
  itOptionsActive: 1,
  stateless: 1,
  anySigWhenPerfectNoOtherMatches: 1,
  anyMaxSizeHitList: 12,
  useHouseNumberList: 1,
  depType: 'stopEvents',
  limit: 20,
  coordListOutputFormat: 'STRING',
  useRealtime: 1,
  zope_command: 'not_set',
  itdLPxx_command: 'not_set',
  itdLPxx_bcl: 'true',
  type_dm: 'any',
  deleteAssignedStops: '1',
  mode: 'direct',
  itdTimeHour: hour,
  itdTimeMinute: min,
  itdDate: dateFull,
  input_dm: '',
  ident_name_dm: '',
  name_dm: haltestelle
};


//Make a Post request with data from above:
request.post({url:'http://txt.bayern-fahrplan.de/textversion/bcl_abfahrtstafel?itdLPxx_bcl=true', formData: formData}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('failed:', err);
  }
  console.log('Response from Bayernfahrplan:', 'Daten geladen!');
  var $ = cheerio.load(body);

  //fetching table object
  $('td', '#departureMonitor').each(function(){
    var data = $(this);
    dataInTable = data.text();


    console.log(dataInTable);


  });

  /*fs.writeFile('output.json', dataInTable, function(err){

      console.log('File successfully written! - Check your project directory for the output.txt file');

  })
*/

  //Web-Server to view the output -> DEV only
  http.createServer(function (req, res) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(dataInTable);
      console.log("Webserver started on localhost:8080");
  }).listen(8080);

});
