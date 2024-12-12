import axios from 'axios';
import fs from 'fs';

async function sendImageToFlask(imagePath) {
  try {
    const imageData = fs.readFileSync(imagePath); 

    const response = await axios.post('http://127.0.0.1:5000/process_image', imageData, {
      headers: {
        'Content-Type': 'image/jpeg', // Adjust based on your image type (e.g., 'image/png', 'image/gif')
      },
    });

    if (response.status === 200) {
      console.log('OCR Result:', response.data.text);
      return response.data.text;
    } else {
      console.error('Error:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Example usage:
const imagePath = "C:\\Users\\RAIKAT\\OneDrive\\Documents\\rail-madad-complaint-registration\\backend\\ocr-test\\ticket.jpg"; 
const ocrText = await sendImageToFlask(imagePath);

console.log(ocrText);