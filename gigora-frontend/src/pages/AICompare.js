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

      const token = "eyJhbGciOiJFUzI1NiIsImtpZCI6IjQ4ZTcyZDEzLTBhNjUtNGNiZS05ZDI3LTY4NzllN2ZhZDE2OCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2RpcHBic25zbXF0Z3J2a2lmbnluLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0NjAzNjI4MS1hNDBjLTQ3MTAtOTdhYi05OTA2NjM4OGVmODYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzg1MTc4NDI1LCJpYXQiOjE3ODUxNzQ4MjUsImVtYWlsIjoicmF6emFxYWJkdWwxMjE4QGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJyYXp6YXFhYmR1bDEyMThAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiNDYwMzYyODEtYTQwYy00NzEwLTk3YWItOTkwNjYzODhlZjg2In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3ODUxNzQ4MjV9XSwic2Vzc2lvbl9pZCI6IjlkYjBhM2RlLTczOTAtNGI3Ny1iOWE5LTg5ZDBkMzY1M2MyZSIsImlzX2Fub255bW91cyI6ZmFsc2V9.zUk5mMmn71Vvr7EIrm7E6u9Dnho62WgMNXA8cVN8RINIlbhE28mirsAJr4vyWR3DeP3oFvMtgy2zn6TeyQ0ymg";
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

