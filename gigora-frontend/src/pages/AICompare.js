import { useState } from "react";
import axios from "axios";

export default function AICompare() {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [showAll, setShowAll] = useState(false);

  const compareModels = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/model-compare",
        {
          job_description: jobDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error comparing models");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>AI Model Comparison</h1>

      <textarea
        rows="8"
        cols="80"
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <br />
      <br />

      <button onClick={compareModels} disabled={loading}>
        {loading ? "Comparing..." : "Compare Models"}
      </button>

      {result && (
        <button
          onClick={() => setShowAll(! showAll)}
          style={{ marginLeft: "10px" }}
        >
          {showAll ? "Show Winner Only" : "See All Proposal"}
        </button>
      )}
      
      {result&&(
        <div style={{marginTop: "30px"}}> <h2>Winner: {result.winner}</h2>
      
        {result.results.filter((item) => showAll || item.model === result.winner).map((item, index) => {
          const isWinner = item.model === result.winner;

          return (
            <div
             key={index}
             style={{
              border: isWinner ? "3px solid green" : "1px solid #ccc",
              backgroundColor: isWinner ? "#e8f5e9" : "white",
              padding: "15px",
              marginTop: "15px",
              borderRadius: "8px",
             }}
            >
              {isWinner && (
                <div
                 style={{
                  background: "green",
                  color: "white",
                  display: "inline-block",
                  padding: "15px 10px",
                  borderRadius: "5px",
                  marginBottom: "10px",
                 }}
                >
                  🏆 Best Result
                </div>
              )}
      
              <h3>{item.model}</h3>

              <p>
                <strong>Score:</strong> {item.score}
              </p>

              <p>{item.proposal}</p>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

