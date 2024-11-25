from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine

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

if __name__ == "__main__":
    app.run(debug=True)
