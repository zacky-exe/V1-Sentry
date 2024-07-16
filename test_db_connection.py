import pyodbc

def get_db_connection():
    conn = pyodbc.connect(
        'DRIVER={ODBC Driver 17 for SQL Server};'
        'SERVER=ZACKY\\SQLEXPRESS;'  # Double backslash for escaping
        'DATABASE=AdminDB;'
        'Trusted_Connection=yes;'
    )
    return conn

def test_connection():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        if result:
            print("Database connection successful!")
        else:
            print("Database connection failed.")
        conn.close()
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == '__main__':
    test_connection()
