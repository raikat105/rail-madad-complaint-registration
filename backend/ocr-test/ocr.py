from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
import os

# Initialize PaddleOCR with automatic language detection
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Initialize Flask app
app = Flask(__name__)

# Create an endpoint for OCR
@app.route('/process-image', methods=['POST'])
def process_image():
    # Check if an image file is present in the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    image_file = request.files['image']

    # Save the image temporarily
    temp_path = os.path.join('temp_image.png')
    image_file.save(temp_path)

    # Perform OCR
    result = ocr.ocr(temp_path, cls=True)

    # Extract and concatenate text
    full_text = ""
    for idx in range(len(result)):
        res = result[idx]
        for line in res:
            full_text += line[1][0] + " "

    # Remove the temporary image file
    os.remove(temp_path)

    # Return the recognized text as a JSON response
    return jsonify({'text': full_text.strip()}), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
