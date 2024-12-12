import React, { useState } from 'react';
import './PnrChecker.css';

const PnrChecker = () => {
  const [image, setImage] = useState(null);
  const [pnr, setPnr] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    setPnr('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      setError('Please upload an image.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://127.0.0.1:5000/process-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.text)
        setPnr(data.text);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pnr-checker">
      <h1>PNR Checker</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="ticket-image">Upload your ticket image:</label>
        <input
          type="file"
          id="ticket-image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Check PNR'}
        </button>
      </form>
      {pnr && (
        <div className="result">
          <h2>Extracted PNR:</h2>
          <p>{pnr}</p>
        </div>
      )}
      {error && (
        <div className="error">
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default PnrChecker;
