import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function sendImageToFlask(imagePath) {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    try {
        const response = await axios.post('http://127.0.0.1:5000/process-image', formData, {
            headers: formData.getHeaders(),
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error sending image:', error.message);
    }
}

sendImageToFlask('./testocr.png');
