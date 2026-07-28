import React, { useState } from "react";

function ProfileAnalyzer() {
  const [profileText, setProfileText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeProfile = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile_text: profileText,
          }),
        }
      );

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error(error);
      alert("Failed to analyze profile");
    }

    setLoading(false);
  };

  return (
    <section>
      <h1>
        Gigora Profile Analyzer
      </h1>

      <label htmlFor="profileText">
  Profile Description
</label>

<textarea
  id="profileText"
  rows="8"
  style={{ width: "100%" }}
  placeholder="Paste profile description here..."
  value={profileText}
  onChange={(e) => setProfileText(e.target.value)}
/>

      <br /><br />

      <button
  aria-label="Analyze freelancer profile"
  onClick={analyzeProfile}
>
  Analyze Profile
</button>

      {loading && <p>Analyzing...</p>}

      {result && (
        <div>
          <h2>
            Score: {result.score}/10
          </h2>

          <h3>Strengths</h3>
          <ul>
            {result.strengths?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Weaknesses</h3>
          <ul>
            {result.weaknesses?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Suggestions</h3>
          <ul>
            {result.suggestions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default ProfileAnalyzer;
