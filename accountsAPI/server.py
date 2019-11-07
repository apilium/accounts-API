"""
Main module
"""

from flask import render_template
import connexion

# Create the application instance
app = connexion.App(__name__, specification_dir="./")

# Read the swagger.yml file to configure the endpoints
app.add_api("swagger.yml")

# Create a URL route in the application for "/"
@app.route("/")
def home():
    """
    This function just responds to the browser URL that is specified in main
    :return:        the rendered template "home.html"
    """
    return render_template("home.html")


if __name__ == "__main__":
    app.run(debug=True, port=5015)
