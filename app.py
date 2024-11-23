from flask import Flask,jsonify,request
import pandas as pd
from datetime import datetime

#load the CSV file
data_path = 'PostgreSQL_weatherdata.csv'
weather_data = pd.read_csv(data_path)

# Ensure that 'last_updated' is in datetime format
weather_data['last_updated'] = pd.to_datetime(weather_data['last_updated'], errors='coerce')

app = Flask(__name__)

@app.route("/")
def home():
    """
    Home route that provides instructions on how to use the API.
    """
    return """
        <html>
        <head>
            <title>World Weather API</title>
        </head>
        <body>
            <h1>Welcome to the World Weather API!</h1>
            <p>Use the following endpoints to query weather data:</p>
            <ul>
                <li><b>/api/weather</b> - Get weather data based on filters</li>
                <li><b>/api/cities</b> - Get a list of all available cities for weather data</li>
            </ul>
            <h3>How to Use:</h3>
            <p>Examples:</p>
            <ul>
                <li><code>/api/weather?location_name=London</code></li>
                <li><code>/api/weather?location_name=London&start_date=06/01/2024</code></li>
                <li><code>/api/weather?location_name=London&end_date=06/01/2024</code></li>
                <li><code>/api/weather?location_name=London&start_date=06/01/2024&end_date=07/01/2024</code></li>
                <li><code>/api/cities</code> - Get all available cities</li>
            </ul>
            <p>Query Parameters (for <code>/api/weather</code>):</p>
            <ul>
                <li><b>location_name</b> (optional): Filter by location name (case-insensitive)</li>
                <li><b>start_date</b> (optional): Filter by start date (format: MM/DD/YYYY)</li>
                <li><b>end_date</b> (optional): Filter by end date (format: MM/DD/YYYY)</li>
            </ul>
            <h3>Response:</h3>
            <p>The API returns JSON data containing the weather information or a list of available cities.</p>
            <h4>Example Response for <code>/api/cities</code>:</h4>
            <pre>{
    "available_cities": ["London", "New York", "Los Angeles"]
}</pre>
        </body>
        </html>
    """


@app.route('/api/weather', methods=['GET'])
def get_weather():
    """
    API endpoint to retrieve weather data with optional filters.
    """
    location = request.args.get('location_name')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Initialize filtered_data with all weather data
    filtered_data = weather_data

    # Filter by location_name
    if location:
        filtered_data = filtered_data[filtered_data['location_name'].str.contains(location, case=False, na=False)]

    # Filter by start_date
    # compare and filter by date
    if start_date:
        try:
            # Convert start_date to datetime format
            start_date = pd.to_datetime(start_date, format="%m/%d/%Y")
            # Apply the filter
            filtered_data = filtered_data[filtered_data['last_updated'] >= start_date]
        except Exception as e:
            return jsonify({'error':f"Invalid start date format:{e}"}),400

     # Filter by end_date 
    if end_date:
        try:
            # Convert start_date to datetime format
            end_date = pd.to_datetime(end_date, format="%m/%d/%Y")
             # Apply the filter
            filtered_data = filtered_data[filtered_data['last_updated'] <= end_date]
        except Exception as e:
            return jsonify({'error':f"Invalid start date format:{e}"}),400
  
    
    if filtered_data.empty:
        return jsonify({'message': 'No matching records found.'}), 404
    
    # Convert to JSON and return
    result = filtered_data.to_dict(orient='records')

    return jsonify({'data':result})

@app.route('/api/cities', methods=['GET'])
def get_cities():
    """
    API endpoint to retrieve a list of all unique cities.
    """
    # Get unique cities from the location_name column
    cities = weather_data['location_name'].dropna().unique()
    
    # Convert the numpy array to a Python list for JSON serialization
    city_list = cities.tolist()

    return jsonify({'available_cities': city_list})

if __name__ == '__main__':
    app.run(debug=True)

