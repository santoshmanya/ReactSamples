import React, { useState } from 'react'; 

function App() {
  // State to hold the message input by the user
  const [message, setMessage] = useState('');
  // State to hold the prediction result from the API
  const [prediction, setPrediction] = useState(null); // Can be null, 'spam', or 'ham' (or other non-spam category)
  // State to indicate if the API call is in progress
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any error messages during the API call
  const [error, setError] = useState(null);
  // State to hold the original message
  const [originalMessage, setOriginalMessage] = useState('');

  // API endpoint URL
  const API_URL = 'http://127.0.0.1:5000/predict';

  // Handler for input changes
  const handleInputChange = (event) => {
    setMessage(event.target.value);
    // Optionally clear previous results when input changes
    setPrediction(null);
    setError(null);
  };

  // Handler for form submission (button click)
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!message.trim()) {
      setError("Please enter a message.");
      return; // Don't submit if message is empty or just whitespace
    }

    setOriginalMessage(message);
    setIsLoading(true); // Show loading state
    setError(null);      // Clear previous errors
    setPrediction(null); // Clear previous predictions

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add other headers if required by your API
        },
        body: JSON.stringify({ message: message }), // Send message in the expected format
      });

      // Check if the response status is OK (e.g., 200)
      if (!response.ok) {
        // Try to get error details from response body if possible
        let errorDetails = `HTTP error! status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorDetails += ` - ${errorData.error || JSON.stringify(errorData)}`;
        } catch (e) {
            // Ignore if response body is not JSON or empty
        }
        throw new Error(errorDetails);
      }

      // Parse the JSON response
      const data = await response.json();

      // Update the prediction state with the result
      setPrediction(data.prediction); // Assumes API returns { "prediction": "spam" | "ham" }

    } catch (e) {
      console.error("Error fetching prediction:", e);
      // Set a user-friendly error message
      setError(`Failed to get prediction. ${e.message}. Please ensure the API server at ${API_URL} is running and accessible.`);
    } finally {
      setIsLoading(false); // Hide loading state regardless of success or failure
    }
  };

  return (
    <div className="App"> {/* Use className for CSS styling */}
      <h1>Spam Detection App</h1>
      <p>Enter a message below to check if it's likely spam.</p>

      {/* Use a form for better accessibility and handling submission */}
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5" // Adjust size as needed
          cols="60" // Adjust size as needed
          value={message}
          onChange={handleInputChange}
          placeholder="Enter your message here..."
          aria-label="Message Input" // For accessibility
          required // Makes the field mandatory in the form
        />
        <br /> {/* Line break for spacing */}
        <button type="submit" disabled={isLoading || !message.trim()}>
          {/* Show different text and disable button while loading or if input is empty */}
          {isLoading ? 'Checking...' : 'Check Message'}
        </button>
      </form>

      {/* Display Loading Indicator */}
      {isLoading && <p>Loading...</p>}

      {/* Display Error Message */}
      {error && (
        <div style={{ color: 'red', marginTop: '15px', border: '1px solid red', padding: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Display Prediction Result */}
      {prediction !== null && !error && ( // Only show if prediction is available and no error occurred
        <div style={{ marginTop: '15px', border: '1px solid green', padding: '10px' }}>
          <h2>Result:</h2>
          <p>
            The message is predicted as: <strong>{prediction.toUpperCase()}</strong>
          </p>
          <p>Original message: "{originalMessage}"</p>
        </div>
      )}
    </div>
  );
}

export default App;
