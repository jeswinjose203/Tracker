var fs = require('fs');
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
        var map, watchId, userPin, selectedValue;
        
        function GetMap() {
          map = new Microsoft.Maps.Map('#myMap', {
            credentials: 'AmhMfBZLCSDiPKsfakqFoNOIQAO2ot6WHmRfJOOByGBtg5zNzKwf6IN7zTl7DH2y'
          });
        }
        
        function StartTracking() {
          GetMap(); // Call GetMap function to initialize the map
          
          userPin = new Microsoft.Maps.Pushpin(map.getCenter(), { visible: false });
          map.entities.push(userPin);
          watchId = navigator.geolocation.watchPosition(UsersLocationUpdated);
        }
        
        function UsersLocationUpdated(position) {
          var loc = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
        
          userPin.setLocation(loc);
          userPin.setOptions({ visible: true });
          map.setView({ center: loc });
            
          var dropdown = document.getElementById("dropdown");
          selectedValue = dropdown.value;
        
          console.log(selectedValue);
          
          if (selectedValue == "BUS 1") {
            console.log("done");
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://chittapan-tracker.onrender.com/bus_no_1/data");
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({ lat: position.coords.latitude, lon: position.coords.longitude }));
          } else if (selectedValue == "BUS 2") {
            console.log("one");
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://chittapan-tracker.onrender.com/bus_no_2/data");
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({ lat: position.coords.latitude, lon: position.coords.longitude }));
          }
        }
        
        function StopTracking() {
          navigator.geolocation.clearWatch(watchId);
          map.entities.clear();
        }
        
        function requestWakeLock() {
          if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen')
              .then((wakeLock) => {
                console.log('Wake Lock acquired');
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
        
        requestWakeLock();
    </script>
    <script type='text/javascript' src='https://www.bing.com/api/maps/mapcontrol?callback=GetMap' async defer></script>
    </html>
  `);
  res.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});