var fs = require('fs');
var http = require('http');
const express = require('express');
const app = express();
const path = require('path');


const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
res.write(`
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta charset="utf-8" />
    
</head>
<body>
    <div id="myMap" style="position:relative;width:600px;height:400px;"></div><br/>
    <input type="button" value="Start Continuous Tracking" onclick="StartTracking()" />
    <input type="button" value="Stop Continuous Tracking" onclick="StopTracking()"/>
    <select id="dropdown">
<option value="BUS 1">BUS 1</option>
<option value="BUS 2">BUS 2</option>
<option value="BUS 3">BUS 3</option>
</select>
</body>
<script type='text/javascript'>
    var map, watchId, userPin,selectedValue;
    
    function GetMap() {
    map = new Microsoft.Maps.Map('#myMap', {
    credentials: 'AmhMfBZLCSDiPKsfakqFoNOIQAO2ot6WHmRfJOOByGBtg5zNzKwf6IN7zTl7DH2y'
    });
    }
    function StartTracking() {
    // Add a pushpin to show the user's location.
    userPin = new Microsoft.Maps.Pushpin(map.getCenter(), { visible: false });
    map.entities.push(userPin);
    // Watch the user's location.
    watchId = navigator.geolocation.watchPosition(UsersLocationUpdated);
    }
    function UsersLocationUpdated(position) {
    var loc = new Microsoft.Maps.Location(
    position.coords.latitude,
    position.coords.longitude
    );
  
    // Update the user pushpin.
    userPin.setLocation(loc);
    userPin.setOptions({ visible: true });
    // Center the map on the user's location.
    map.setView({ center: loc });
        
    // Send the location data to the server.
    var dropdown = document.getElementById("dropdown");
    selectedValue = dropdown.value;

    console.log(selectedValue);
    
    if(selectedValue=="BUS 1")
    {
      console.log("done");
      var xhr = new XMLHttpRequest();
    //xhr.open("POST", "http://127.0.0.1:3030/bus_no_1/data");
    xhr.open("POST", "https://chittapan-tracker.onrender.com/bus_no_1/data");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ lat: position.coords.latitude, lon: position.coords.longitude }));
    }
    else if(selectedValue=="BUS 2")
    {
      console.log("one");
      var xhr = new XMLHttpRequest();
      //xhr.open("POST", "http://127.0.0.1:3030/bus_no_2/data");
    xhr.open("POST", "https://chittapan-tracker.onrender.com/bus_no_2/data");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ lat: position.coords.latitude, lon: position.coords.longitude }));
    }
    
    }
    
    
    function StopTracking() {
    // Cancel the geolocation updates.
    navigator.geolocation.clearWatch(watchId);
    // Remove the user pushpin.
    map.entities.clear();
    }
</script>
<script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap' async defer></script>
<script type='text/javascript'>
let wakeLock = null;

const requestWakeLock = async () => {
try {
wakeLock = await navigator.wakeLock.request('screen');
console.log('Wake Lock acquired');
} catch (err) {
console.log(err);
}
};
requestWakeLock();
</script>
</html>
`);
res.end();
});
http.createServer(app).listen(PORT);