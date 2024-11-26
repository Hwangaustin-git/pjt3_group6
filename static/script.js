// Function to populate the dropdown menu with cities
function populateDropdown() {
    console.log("Populating dropdown menu...");
    fetch('/api/cities')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(cities => {
            console.log("Fetched cities:", cities); // Log fetched cities
            const dropdown = document.getElementById('city-dropdown');
            dropdown.innerHTML = '<option value="" disabled selected>Select a city</option>'; // Reset dropdown

            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                dropdown.appendChild(option);
            });

            console.log("Dropdown populated successfully.");
        })
        .catch(error => {
            console.error("Error populating dropdown:", error);
            document.getElementById('humidity-visualization').innerHTML = '<p>Error loading cities.</p>';
            document.getElementById('windspeed-visualization').innerHTML = '<p>Error loading cities.</p>';
        });
}

// Function to sample data for better visualization
function sampleData(data, step) {
    return data.filter((_, index) => index % step === 0);
}

// Function to fetch and plot weather data
function fetchAndPlotWeather(location, startDate, endDate) {
    const apiUrl = `/api/weather?location_name=${location}&start_date=${startDate}&end_date=${endDate}`;
    console.log("Fetching weather data from URL:", apiUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched weather data:", data); // Log the data

            if (data.length === 0) {
                document.getElementById('humidity-visualization').innerHTML = '<p>No data available for the selected city and date range.</p>';
                document.getElementById('windspeed-visualization').innerHTML = '<p>No data available for the selected city and date range.</p>';
                return;
            }

            // Process the data
            const dates = data.map(entry => new Date(entry.last_updated).toLocaleString('default', { month: 'short', year: 'numeric' }));
            const humidity = data.map(entry => entry.humidity);
            const windSpeed = data.map(entry => entry.wind_mph);

            // Sample the data for better visualization
            const sampledDates = sampleData(dates, 5);  // Change 5 to adjust sampling frequency
            const sampledHumidity = sampleData(humidity, 5);
            const sampledWindSpeed = sampleData(windSpeed, 5);

            // Create traces for Humidity
            const humidityTrace = {
                x: sampledDates,
                y: sampledHumidity,
                mode: 'lines+markers',
                name: 'Humidity (%)',
                line: { color: 'blue', opacity: 0.6 },
                marker: { size: 4, color: 'blue' }
            };

            // Create traces for Wind Speed
            const windSpeedTrace = {
                x: sampledDates,
                y: sampledWindSpeed,
                mode: 'lines+markers',
                name: 'Wind Speed (mph)',
                line: { color: 'green', opacity: 0.6 },
                marker: { size: 4, color: 'green' }
            };

            // Define layouts for Humidity
            const layoutHumidity = {
                title: `Humidity for ${location} (May 2024 - Nov 2024)`,
                xaxis: { title: 'Month' },
                yaxis: { title: 'Humidity (%)', titlefont: { color: 'blue' }, tickfont: { color: 'blue' } },
                width: 1000,
                height: 300
            };

            // Define layouts for Wind Speed
            const layoutWindSpeed = {
                title: `Wind Speed for ${location} (May 2024 - Nov 2024)`,
                xaxis: { title: 'Month' },
                yaxis: { title: 'Wind Speed (mph)', titlefont: { color: 'green' }, tickfont: { color: 'green' } },
                width: 1000,
                height: 300
            };

            // Plot the graphs
            Plotly.newPlot('humidity-visualization', [humidityTrace], layoutHumidity);
            Plotly.newPlot('windspeed-visualization', [windSpeedTrace], layoutWindSpeed);
        })
        .catch(error => {
            console.error("Error fetching or plotting weather data:", error);
            document.getElementById('humidity-visualization').innerHTML = '<p>Error occurred while fetching humidity data.</p>';
            document.getElementById('windspeed-visualization').innerHTML = '<p>Error occurred while fetching wind speed data.</p>';
        });
}

// Handle form submission
document.getElementById('dropdown-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission reload

    // Get the selected city
    const dropdown = document.getElementById('city-dropdown');
    const location = dropdown.value;

    // Define date range (May to November 2024)
    const startDate = "2024-05-01";
    const endDate = "2024-11-30";

    if (!location) {
        alert("Please select a city.");
        return;
    }

    // Fetch and plot data
    fetchAndPlotWeather(location, startDate, endDate);
});

// Populate dropdown on page load
document.addEventListener('DOMContentLoaded', populateDropdown);
