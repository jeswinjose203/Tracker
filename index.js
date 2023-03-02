var fs = require('fs');
var http = require('http');
const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3030;

app.use(express.urlencoded({ extended: true }));
app.get('/',function(req,res){
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
</body>
<script type='text/javascript'>
    var map, watchId, userPin;

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
        /*
    // Send the location data to the server.
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://chittapan-tracker.onrender.com/data");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ lat: position.coords.latitude, lon: position.coords.longitude }));
    */
    const ws = new WebSocket("wss://chittapan-tracker.onrender.com");

    // Send the location data to the server when the WebSocket connection is open
    ws.addEventListener("open", () => {
      const locationData = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
      ws.send(JSON.stringify(locationData));
    });
    }

    function StopTracking() {
    // Cancel the geolocation updates.
    navigator.geolocation.clearWatch(watchId);

    // Remove the user pushpin.
    map.entities.clear();
    }

</script>
<script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap' async defer></script>
</html>
    `);
    res.end();
});
http.createServer(app).listen(PORT);