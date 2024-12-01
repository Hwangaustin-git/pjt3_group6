// Create the map and set the starting view
var map = L.map('map').setView([0, 0], 2); // Centered on the world, zoomed out

// Add a map background (tiles) using OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenStreetMap contributors'
}).addTo(map);

// Example weather data
const weatherData = [
    { city: "New York", lat: 40.7128, lon: -74.0060, temp: 25, condition: "Sunny" },
    { city: "London", lat: 51.5074, lon: -0.1278, temp: 18, condition: "Rainy" },
    { city: "Tokyo", lat: 35.6895, lon: 139.6917, temp: 30, condition: "Cloudy" }
];

// Add markers to the map for each city's weather
weatherData.forEach(location => {
    L.marker([location.lat, location.lon]).addTo(map)
     .bindPopup(`
         <b>${location.city}</b><br>
         Temperature: ${location.temp}°C<br>
         Condition: ${location.condition}
     `);
});

// Example temperature data [latitude, longitude, intensity]
const temperatureData = [
    [40.7128, -74.0060, 30], // New York, warm (30°C)
    [51.5074, -0.1278, 18],  // London, cool (18°C)
    [35.6895, 139.6917, 5],  // Tokyo, cold (5°C)
];

// Create the heatmap layer
L.heatLayer(temperatureData, {
    radius: 25,         // Radius of each "heat" point
    blur: 15,           // Blurring to smooth the gradient
    maxZoom: 17,        // Max zoom for the heatmap
    gradient: {         // Define custom color gradients
        0.0: 'purple',  // Coldest
        0.3: 'blue',
        0.5: 'green',
        0.7: 'yellow',
        1.0: 'red'      // Hottest
    }
}).addTo(map);

// This will create a heatmap overlay where warm temperatures appear red/yellow/orange, and cool ones appear blue/green/purple.

// Example GeoJSON data for areas
const geoData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-74.00, 40.70],  // New York
                    [-73.90, 40.70],
                    [-73.90, 40.80],
                    [-74.00, 40.80],
                    [-74.00, 40.70]
                ]]
            },
            "properties": { "temperature": 30 }
        },
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-0.13, 51.50],  // London
                    [-0.11, 51.50],
                    [-0.11, 51.52],
                    [-0.13, 51.52],
                    [-0.13, 51.50]
                ]]
            },
            "properties": { "temperature": 10 }
        }
    ]
};

// Define a color function based on temperature
function getColor(temp) {
    return temp > 25 ? 'red' :
           temp > 20 ? 'orange' :
           temp > 15 ? 'yellow' :
           temp > 10 ? 'green' :
           temp > 5  ? 'blue' :
                       'purple';
}
// Style each feature based on its temperature property
function style(feature) {
    return {
        fillColor: getColor(feature.properties.temperature),
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.6
    };
}

// Add the GeoJSON layer to the map
L.geoJSON(geoData, { style: style }).addTo(map);
