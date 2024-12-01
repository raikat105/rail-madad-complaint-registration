from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/upload', methods=['POST'])
def handle_upload():
    try:
        data = request.get_json(force=True)
        print("Received data:", data)
        return jsonify({"message": "Data received successfully", "data": data}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
