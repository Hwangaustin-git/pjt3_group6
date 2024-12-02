from flask import Flask, jsonify, request, render_template
from sqlalchemy import create_engine
from sqlalchemy.sql import text
import pandas as pd
import geopandas as gpd
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# SQLite database connection
DATABASE_PATH = "data/weather_data.sqlite"
DATABASE_URI = f"sqlite:///{DATABASE_PATH}"
engine = create_engine(DATABASE_URI)

# Load the CSV dataset for GeoDataFrame functionality
average_weather = pd.read_csv("data/PostgreSQL_weatherdata.csv")
average_weather['last_updated'] = pd.to_datetime(average_weather['last_updated'])
average_weather['month'] = average_weather['last_updated'].dt.strftime('%B %Y')

# Convert to GeoDataFrame
gdf = gpd.GeoDataFrame(
    average_weather,
    geometry=gpd.points_from_xy(average_weather['longitude'], average_weather['latitude'])
)
gdf['last_updated'] = gdf['last_updated'].dt.strftime('%Y-%m-%d %H:%M:%S')
gdf['search_field'] = gdf['country'] + " - " + gdf['location_name']

@app.route("/")
def index():
    """
    Serve the main HTML page.
    """
    return render_template("index.html")

@app.route('/api/weather', methods=['GET'])
def get_weather():
    # Extract user inputs
    location = request.args.get('location_name')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    # Construct SQL query
    query = "SELECT * FROM weather_data WHERE 1=1"
    params = {}
    if location:
        query += " AND location_name LIKE :location"
        params['location'] = f"%{location}%"
    if start_date:
        query += " AND last_updated >= :start_date"
        params['start_date'] = start_date
    if end_date:
        query += " AND last_updated <= :end_date"
        params['end_date'] = end_date

    # Fetch data from the database
    try:
        with engine.connect() as connection:
            result = connection.execute(text(query), params)
            rows = result.fetchall()
            data = [dict(row._mapping) for row in rows]
            return jsonify(data)
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while fetching data."}), 500
    
@app.route('/api/cities', methods=['GET'])
def get_cities():
    """
    API endpoint to retrieve a list of all unique cities.
    """
    query = "SELECT DISTINCT location_name FROM weather_data ORDER BY location_name ASC"

    try:
        with engine.connect() as connection:
            result = connection.execute(text(query))
            rows = result.fetchall()
            # Access rows properly
            cities = [row[0] for row in rows]  # Use tuple index to access the first column
            return jsonify(cities)  # Return a list of city names
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({"error": "An error occurred while fetching cities."}), 500
    
@app.route('/api/weather_data', methods=['GET'])
def get_weather_data():
    """
    Serve weather data from the GeoDataFrame in GeoJSON format.
    """
    try:
        geojson_data = gdf.to_json()
        return jsonify(geojson_data)
    except Exception as e:
        print(f"GeoDataFrame error: {e}")
        return jsonify({"error": "An error occurred while fetching GeoDataFrame data."}), 500

if __name__ == "__main__":
    app.run(debug=True)
