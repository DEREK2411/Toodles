import sqlite3
import csv

DATABASE = 'products.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                image_url TEXT NOT NULL,
                quantity INTEGER NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cart (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                image_url TEXT NOT NULL,
                quantity INTEGER NOT NULL
            )
        ''')
        import_csv_to_db('products.csv', 'products')
        import_csv_to_db('cart.csv', 'cart')

def import_csv_to_db(csv_file, table):
    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)
        data = [
            (row['id'], row['name'], row['price'], row['image_url'], row.get('quantity', 1))
            for row in reader
        ]
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.executemany(f'''
            INSERT OR REPLACE INTO {table} (id, name, price, image_url, quantity)
            VALUES (?, ?, ?, ?, ?)
        ''', data)
        conn.commit()
