
  
    var fs = require('fs');
    var http = require('http');
    const express = require('express');
    const app = express();
    const path = require('path');
    
    const cors = require('cors');
    const PORT = process.env.PORT || 3020;
    //app.use(cors({ origin: 'http://127.0.0.1:3020' }));
    app.use(cors({ origin: 'https://tracker-41x9.onrender.com' }));
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
            <input type="button" value="Start Continuous Tracking" onclick="startTracking()" />
            <input type="button" value="Stop Continuous Tracking" onclick="stopTracking()"/>
            <select id="dropdown">
                <option value="BUS 1">BUS 1</option>
                <option value="BUS 2">BUS 2</option>
                <option value="BUS 3">BUS 3</option>
            </select>
    
            <script type='text/javascript'>
                var map, watchId, userPin, selectedValue;
    
                function getMap() {
                    map = new Microsoft.Maps.Map('#myMap', {
                        credentials: 'AmhMfBZLCSDiPKsfakqFoNOIQAO2ot6WHmRfJOOByGBtg5zNzKwf6IN7zTl7DH2y'
                    });
                }
    
                function startTracking() {
                    userPin = new Microsoft.Maps.Pushpin(map.getCenter(), { visible: false });
                    map.entities.push(userPin);
                    watchId = navigator.geolocation.watchPosition(usersLocationUpdated);
    
                    // Send the location data to the server every 5 seconds

                }
    
                function usersLocationUpdated(position) {
                    var loc = new Microsoft.Maps.Location(
                        position.coords.latitude,
                        position.coords.longitude
                    );
    
                    userPin.setLocation(loc);
                    userPin.setOptions({ visible: true });
                    map.setView({ center: loc });
    
                    var dropdown = document.getElementById("dropdown");
                    selectedValue = dropdown.value;
                }
    
                function sendLocationData() {
                    if (selectedValue === "BUS 1") {
                        console.log("Sending location data for BUS 1");
                        var xhr = new XMLHttpRequest();
                        //xhr.open("POST", "http://127.0.0.1:3030/bus_no_1/data");
                        xhr.open("POST", "https://chittapan-tracker.onrender.com/bus_no_1/data");
                        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        xhr.send(JSON.stringify({ lat: map.getCenter().latitude, lon: map.getCenter().longitude }));
                    } else if (selectedValue === "BUS 2") {
                        console.log("Sending location data for BUS 2");
                        var xhr = new XMLHttpRequest();
                        //xhr.open("POST", "http://127.0.0.1:3030/bus_no_2/data");
                        xhr.open("POST", "https://chittapan-tracker.onrender.com/bus_no_2/data");
                        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                        xhr.send(JSON.stringify({ lat: map.getCenter().latitude, lon: map.getCenter().longitude }));
                    }
                }
    
                function stopTracking() {
                    navigator.geolocation.clearWatch(watchId);
                    map.entities.clear();
                }
            </script>
            <script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=getMap' async defer></script>
        </body>
        </html>
      `);
      res.end();
    });
    
    http.createServer(app).listen(PORT);