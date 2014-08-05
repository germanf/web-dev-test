var express = require('express'),
    charts = require('./routes/charts.js'),
    cors = require('cors');

var app = express();

app.use(cors());

app.get('/charts', charts.findAll);
app.get('/charts/:id', charts.findById);
app.get('/charts/:id/data', charts.getChartData);
app.get('/charts/:id/data/:date', charts.getChartDataForDate);

app.listen(3000);
console.log('Listening on port 3000...');
