import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    alphabets: false,
    numbers: false,
    highestAlphabet: false,
  });

  const handleSubmit = async () => {
    try {
      setError(null);
      const jsonData = JSON.parse(input);
      const res = await axios.post("http://localhost:5000/bfhl", jsonData);
      setResponse(res.data);
      alert('Submission successful!');
    } catch (err) {
      setError("Invalid JSON or server error");
      alert('Submission failed: ' + err.message); // Alert on error
    }
  };

  const handleSelectChange = (event) => {
    console.log(event.target);
    console.log(selectedOptions);
    const { name, checked } = event.target;
    setSelectedOptions((prev) => ({ ...prev, [name]: checked }));
    console.log(event.target.checked);
  };

  const renderResponse = () => {
    if (!response) return null;

    const data = {};
    if (selectedOptions.numbers) data.numbers = response.numbers;
    if (selectedOptions.alphabets) data.alphabets = response.alphabets;
    if (selectedOptions.highestAlphabet)
      data.highestAlphabet = response.highest_alphabet;

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <div className="container">
      <h1>Enter The Data</h1>
     <div className="form-floating">
            <textarea
                className="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea2"
                style={{ height: '100px' }}
                rows="10"
                cols="50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
        </div>
        <div className="my-2">

      <button  type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>

      {error && <p>{error}</p>}

      <div>


        <label>
          <input
            type="checkbox"
            name="alphabets"
            // checked={selectedOptions.alphabets}
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
          Highest Alphabet
        </label>
      </div>

      <div>{renderResponse()}</div>
    </div>
  );
};

export default App;
