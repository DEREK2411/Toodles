from flask import Flask
from routes import init_routes
from database import init_db
# import os

app = Flask(__name__)

# Initialize and register routes
init_routes(app)

if __name__ == '__main__':
    if not os.path.exists('products.db'):
        init_db()
    app.run(debug=True, port=8900)
