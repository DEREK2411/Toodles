# MyFlask Project

## Description

MyFlask is a web application built using the Flask framework. It provides an e-commerce-like platform where users can browse products, add them to a cart, and proceed to checkout. The application includes features such as a dynamic product grid, cart management, and payment options.

## Features

- Dynamic product listing with images, names, and prices.
- Add products to the cart and manage quantities.
- View cart details, including total price and itemized list.
- Checkout functionality with payment options (Cash on Delivery or Online Payment).
- Responsive design with carousel and interactive UI elements.

## Prerequisites

Before running the project, ensure you have the following installed:

- Python 3.10 or higher
- pip (Python package manager)
- Virtual environment support (optional but recommended)

## Installation and Setup

Follow these steps to set up and run the project locally:

1. **Clone the Repository**  
   Clone the project repository to your local machine:
   ```bash
   git clone <repository-url>
   cd MyFlask
   ```

2. **Set Up a Virtual Environment**  
   Create and activate a virtual environment:
   ```bash
   python -m venv myenv
   source myenv/bin/activate   # On Linux/Mac
   myenv\Scripts\activate      # On Windows
   ```

3. **Install Dependencies**  
   Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**  
   Start the Flask development server:
   ```bash
   flask run
   ```
   The application will be accessible at `http://127.0.0.1:5000`.

5. **Access the Application**  
   Open your web browser and navigate to `http://127.0.0.1:5000` to use the application.

## Project Structure

```
MyFlask/
│
├── static/                 # Static files (CSS, JS, images)
│   ├── styles.css          # Stylesheet for the application
│   ├── scripts.js          # JavaScript for dynamic functionality
│   └── ...                 # Other static assets
│
├── templates/              # HTML templates
│   ├── index.html          # Main page template
│   └── ...                 # Other templates
│
├── app.py                  # Main Flask application file
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation
└── ...                     # Other files and directories
```

## Key Files

- `app.py`: The main entry point for the Flask application.
- `static/scripts.js`: Contains JavaScript for cart management, product loading, and UI interactions.
- `templates/index.html`: The main HTML template for the application.

## Usage

- **Browse Products**: View the product grid on the homepage.
- **Add to Cart**: Click "Buy Now" to add products to the cart.
- **View Cart**: Open the cart section to see added items and their total price.
- **Checkout**: Proceed to checkout and select a payment method.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
