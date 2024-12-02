# Vacation Weather Guide

## Table of contents

* [Description](#Description)
* [Features](#Features)
* [Project Structure](#Project-Structure)
* [Technologies](#Technologies)
* [Usage](#Usage)
* [Data Sources](#Data-Sources)
* [Running Application Image](#Running-Application-Image)
* [Contributors](#Contributors)
* [Questions](#Questions)
* [References](#References)

## Description

This project is a dynamic web-based dashboard that provides interactive visualizations of weather data, including temperature, humidity, wind speed, and UV index. The dashboard allows users to explore weather patterns for selected cities and time ranges using data sourced from a backend API. 

## Features

* **Interactive Dropdown:** Select cities from a dropdown menu populated dynamically from the server.
* **Monthly Averages:** Displays monthly averages for temperature, humidity, wind speed, and UV index in visual charts.
* **Multiple Visualizations:**

- Line charts for temperature, humidity, and wind speed.
- Bubble chart for UV index, with the size and color of bubbles representing UV intensity.

* **Map Integration:** Interactive map visualizing weather data across global locations with custom markers.
* **Optimal Guidelines:** Overlay guidelines for optimal weather conditions (e.g., temperature, humidity).

## Project Structure

├── index.html        # HTML structure for the dashboard  
├── style.css         # CSS styling for the dashboard  
├── script.js         # JavaScript for client-side interactivity  
├── /api              # Backend API endpoints  
│   ├── cities        # Endpoint to fetch available cities  
│   ├── weather       # Endpoint to fetch weather data for a location  
├── data.csv          # CSV file containing weather data (used for UV index bubble chart)  
├── README.md         # Project documentation  


## Technologies

* **Frontend:**

- HTML, CSS, JavaScript
- Plotly.js for visualizations
- Leaflet.js for map integration

* **Backend:**

- Flask 
- API endpoints for dynamic data fetching

## Usage

1. Select a city from the dropdown menu.
2. View visualizations for temperature, humidity, wind speed, and UV index.
3. Explore weather trends on the map using the month filter.

## Data Sources

* Weather data is fetched dynamically via the /api/weather endpoint.
* UV index data is read from data.csv.

## Running Application Image

![Vacation Weather Guide](/data/VacationWeatherGuide.gif)

## Contributors

This project is a collaboration between:

* [Austin Hwang](https://github.com/Hwangaustin-git)
* [Beiting Ouyang](https://github.com/bettyoy310)
* [Chris Alvizures](https://github.com/ChrisAlvi)
* [Feda Zidan](https://github.com/Feda2020)
* [Carissa Guzman](https://github.com/CarissaSG)

## Questions

In case of any additional questions please visit my GitHub link: check the [Contributors](#Contributors)

## References

* StackOverflow (https://stackoverflow.com/)
* Xpert Learning (https://bootcampspot.com)
* D3.js Tutorials (https://www.tutorialsteacher.com/d3js)
* Leaflet Documentation (https://leafletjs.com/reference.html)
