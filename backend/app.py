import os
import subprocess
import tempfile
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(_name_)
CORS(app)  # Enable CORS for all routes

CLOUDINARY_CLOUD_NAME = "dehbw4s0x"  # Replace with your Cloudinary cloud name
CLOUDINARY_UPLOAD_PRESET = "comp_reg"  # Replace with your Cloudinary unsigned preset

def upload_to_cloudinary(file_path, resource_type="auto"):
    """Uploads a file to Cloudinary and returns the secure URL."""
    url = f"https://api.cloudinary.com/v1_1/{CLOUDINARY_CLOUD_NAME}/{resource_type}/upload"
    with open(file_path, "rb") as file:
        response = requests.post(
            url,
            files={"file": file},
            data={"upload_preset": CLOUDINARY_UPLOAD_PRESET}
        )
        if response.status_code == 200:
            return response.json().get("secure_url")
        else:
            raise Exception(f"Failed to upload to Cloudinary: {response.json()}")

@app.route('/upload', methods=['POST'])
def handle_upload():
    try:
        data = request.get_json(force=True)
        print("Received data:", data)

        video_url = data.get('videoUrl')
        if not video_url:
            return jsonify({"error": "No video URL provided"}), 400

        # Temporary directory to store frames
        temp_dir = tempfile.mkdtemp()
        output_pattern = os.path.join(temp_dir, "frame_%03d.jpg")

        # Use ffmpeg to extract 20 frames from the video
        try:
            subprocess.run(
                [
                    "ffmpeg", "-i", video_url,
                    "-vf", "select='not(mod(n,5))'",  # Get every 5th frame
                    "-frames:v", "20",  # Limit to 20 frames
                    "-vsync", "vfr", output_pattern
                ],
                check=True
            )

            # Upload frames to Cloudinary and collect URLs
            frame_files = sorted([os.path.join(temp_dir, f) for f in os.listdir(temp_dir)])
            cloudinary_urls = []
            for frame in frame_files:
                url = upload_to_cloudinary(frame)
                cloudinary_urls.append(url)

            # Return the Cloudinary URLs to the frontend
            return jsonify({"message": "Frames uploaded successfully", "frames": cloudinary_urls}), 200

        except subprocess.CalledProcessError as e:
            print("Error during ffmpeg processing:", e)
            return jsonify({"error": "Failed to extract frames from video"}), 500

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 400

if _name_ == '_main_':
    app.run(debug=True)