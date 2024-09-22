import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [input, setInput] = useState(""); // For JSON data
  const [file, setFile] = useState(null); // For file input
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    alphabets: false,
    numbers: false,
    highestAlphabet: false,
  });

  // Convert file to Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Base64 part
      reader.onerror = error => reject(error);
    });
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setFile(base64); // Set the Base64 encoded file
      } catch (error) {
        alert("File reading error: " + error.message);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setError(null);
      const jsonData = JSON.parse(input); // Parse input data
      
      const payload = {
        data: jsonData.data, // Data from input
        file_b64: file || "" // Add Base64 file string or empty if no file selected
      };
      
      const res = await axios.post("https://temp-backend-five.vercel.app/bfhl", payload);
      setResponse(res.data);
      console.log(res.data);
      console.log("Hello");
      alert('Submission successful!');
    } catch (err) {
      setError("Invalid JSON or server error");
      alert('Submission failed: ' + err.message); // Alert on error
    }
  };

  // Handle checkbox changes
  const handleSelectChange = (event) => {
    const { name, checked } = event.target;
    setSelectedOptions((prev) => ({ ...prev, [name]: checked }));
  };

  // Render response based on selected options
  const renderResponse = () => {
    if (!response) return null;
  
    let formattedResponse = '';
  
    if (selectedOptions.numbers && response.numbers) {
      formattedResponse += `Numbers: ${response.numbers.join(', ')}\n`;
    }
  
    if (selectedOptions.alphabets && response.alphabets) {
      formattedResponse += `Alphabets: ${response.alphabets.join(', ')}\n`;
    }
  
    if (selectedOptions.highestAlphabet && response.highest_lowercase_alphabet) {
      formattedResponse += `Highest Lowercase Alphabet: ${response.highest_lowercase_alphabet.join(', ')}\n`;
    }
  
    return <pre>{formattedResponse.trim()}</pre>;
  };

  return (
    <div className="container">
      <h1>Enter The Data</h1>

      {/* Input for JSON data */}
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="Enter JSON data"
          id="floatingTextarea2"
          style={{ height: '100px' }}
          rows="10"
          cols="50"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* File input */}
      <div>
        <label htmlFor="fileInput">Choose a file:</label>
        <input type="file" id="fileInput" onChange={handleFileChange} />
      </div>

      {/* Submit button */}
      <div className="my-2">
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
      </div>

      {/* Error handling */}
      {error && <p>{error}</p>}

      {/* Checkbox options */}
      <div>
        <label>
          <input
            type="checkbox"
            name="alphabets"
            checked={selectedOptions.alphabets}
            onChange={handleSelectChange}
          />
          Alphabets
        </label>
        <label>
          <input
            type="checkbox"
            name="numbers"
            checked={selectedOptions.numbers}
            onChange={handleSelectChange}
          />
          Numbers
        </label>
        <label>
          <input
            type="checkbox"
            name="highestAlphabet"
            checked={selectedOptions.highestAlphabet}
            onChange={handleSelectChange}
          />
          Highest Lowercase Alphabet
        </label>
      </div>

      {/* Render the response */}
      <div>{renderResponse()}</div>
    </div>
  );
};

export default App;
