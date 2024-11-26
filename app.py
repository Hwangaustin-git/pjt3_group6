from flask import Flask, jsonify, request, render_template
from sqlalchemy import create_engine
from sqlalchemy.sql import text


# Initialize the Flask app
app = Flask(__name__)

# SQLite database connection
DATABASE_PATH = "data/weather_data.sqlite"
DATABASE_URI = f"sqlite:///{DATABASE_PATH}"
engine = create_engine(DATABASE_URI)

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


if __name__ == "__main__":
    app.run(debug=True)
