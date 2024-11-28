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

// Function to calculate monthly averages
function calculateMonthlyAverages(data) {
    const monthlyData = {};
    data.forEach(entry => {
        const month = new Date(entry.last_updated).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) {
            monthlyData[month] = { humidity: [], windSpeed: [] };
        }
        monthlyData[month].humidity.push(entry.humidity);
        monthlyData[month].windSpeed.push(entry.wind_mph);
    });

    const averages = Object.keys(monthlyData).map(month => ({
        month,
        avgHumidity: (monthlyData[month].humidity.reduce((a, b) => a + b, 0) / monthlyData[month].humidity.length).toFixed(2),
        avgWindSpeed: (monthlyData[month].windSpeed.reduce((a, b) => a + b, 0) / monthlyData[month].windSpeed.length).toFixed(2),
    }));

    return averages;
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
            console.log("Fetched weather data:", data);

            if (data.length === 0) {
                document.getElementById('humidity-visualization').innerHTML = '<p>No data available for the selected city and date range.</p>';
                document.getElementById('windspeed-visualization').innerHTML = '<p>No data available for the selected city and date range.</p>';
                return;
            }

            // Calculate monthly averages
            const averages = calculateMonthlyAverages(data);

            // Prepare data for Humidity Plot
            const months = averages.map(entry => entry.month);
            const avgHumidity = averages.map(entry => entry.avgHumidity);

            const humidityTrace = {
                x: months,
                y: avgHumidity,
                mode: 'lines+markers',
                name: 'Avg Humidity (%)',
                line: { color: 'blue', width: 2 },
                marker: { size: 6, color: 'blue' }
            };

            const humidityGuidelineTrace = {
                x: months,
                y: Array(months.length).fill(60), // Optimal humidity guideline (example: 60%)
                mode: 'lines',
                name: 'Optimal Humidity (%)',
                line: { color: 'gray', dash: 'dot' }
            };

            const layoutHumidity = {
                title: `Average Humidity for ${location} (May 2024 - Nov 2024)`,
                xaxis: { title: 'Month' },
                yaxis: { title: 'Avg Humidity (%)', titlefont: { color: 'blue' }, tickfont: { color: 'blue' } },
                width: 1000,
                height: 400
            };

            // Prepare data for Wind Speed Plot
            const avgWindSpeed = averages.map(entry => entry.avgWindSpeed);

            const windSpeedTrace = {
                x: months,
                y: avgWindSpeed,
                mode: 'lines+markers',
                name: 'Avg Wind Speed (mph)',
                line: { color: 'green', width: 2 },
                marker: { size: 6, color: 'green' }
            };

            const windSpeedGuidelineTrace = {
                x: months,
                y: Array(months.length).fill(10), // Optimal wind speed guideline (example: 10 mph)
                mode: 'lines',
                name: 'Optimal Wind Speed (mph)',
                line: { color: 'gray', dash: 'dot' }
            };

            const layoutWindSpeed = {
                title: `Average Wind Speed for ${location} (May 2024 - Nov 2024)`,
                xaxis: { title: 'Month' },
                yaxis: { title: 'Avg Wind Speed (mph)', titlefont: { color: 'green' }, tickfont: { color: 'green' } },
                width: 1000,
                height: 400
            };

            // Plot the graphs
            Plotly.newPlot('humidity-visualization', [humidityTrace, humidityGuidelineTrace], layoutHumidity);
            Plotly.newPlot('windspeed-visualization', [windSpeedTrace, windSpeedGuidelineTrace], layoutWindSpeed);
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

    const dropdown = document.getElementById('city-dropdown');
    const location = dropdown.value;

    const startDate = "2024-05-01";
    const endDate = "2024-11-30";

    if (!location) {
        alert("Please select a city.");
        return;
    }

    fetchAndPlotWeather(location, startDate, endDate);
});

// Populate dropdown on page load
document.addEventListener('DOMContentLoaded', populateDropdown);
