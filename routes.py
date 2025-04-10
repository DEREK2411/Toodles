from flask import request, jsonify, render_template
from database import get_db_connection

def init_routes(app):
    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/products', methods=['GET'])
    def get_products():
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM products')
                products = cursor.fetchall()
            return jsonify([dict(row) for row in products])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/cart', methods=['GET'])
    def get_cart():
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM cart')
                cart = cursor.fetchall()
            return jsonify([dict(row) for row in cart])
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/cart', methods=['POST'])
    def add_to_cart():
        try:
            product_id = request.json['product_id']
            quantity = int(request.json.get('quantity', 1))
        except (KeyError, ValueError) as e:
            return jsonify({'error': str(e)}), 400

        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
                product = cursor.fetchone()
                if not product:
                    return jsonify({'error': 'Product not found'}), 404
                
                cursor.execute('SELECT * FROM cart WHERE id = ?', (product_id,))
                cart_item = cursor.fetchone()
                
                if cart_item:
                    new_quantity = cart_item['quantity'] + quantity
                    cursor.execute('UPDATE cart SET quantity = ? WHERE id = ?', (new_quantity, product_id))
                else:
                    cursor.execute('INSERT INTO cart (id, name, price, image_url, quantity) VALUES (?, ?, ?, ?, ?)', 
                                   (product['id'], product['name'], product['price'], product['image_url'], quantity))
                
                conn.commit()

            return jsonify({'message': 'Product added to cart'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/cart', methods=['DELETE'])
    def clear_cart():
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('DELETE FROM cart')
                conn.commit()
            return jsonify({'message': 'Cart cleared'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/checkout', methods=['POST'])
    def checkout():
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM cart')
                cart = cursor.fetchall()
            
            if not cart:
                return jsonify({'error': 'Cart is empty'}), 400

            total_amount = sum(float(item['price']) * item['quantity'] for item in cart)
            return jsonify({'message': f'Checkout successful. Total amount: ₹{total_amount:.2f}'}), 200
        except ValueError:
            return jsonify({'error': 'Invalid price'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
