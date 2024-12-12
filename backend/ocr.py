from flask import Flask, request, jsonify
from paddleocr import PaddleOCR
import os
from flask_cors import CORS

# Initialize PaddleOCR with automatic language detection
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Initialize Flask app
app = Flask(__name__)
CORS(app)

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
    full_text = full_text.strip()
    var = full_text.split()
    k = 0
    print(var)
    for i in range (len(var)):
        if (var[i] == "PNR") :
            for j in range (i + 1, len(var)) :
                if (len(var[j]) == 10) :
                    print(var[j])
                    k = j
                    break
    return jsonify({'text': var[k]}), 200

# Run the Flask app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
