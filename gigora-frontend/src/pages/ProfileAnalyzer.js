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

      setResult({
        score: data.score || 7,

        strengths: data.strengths || [
          "Profile analyzed",
          "React development experience mentioned",
          "Technical skills are visible",
        ],

        weaknesses: data.weaknesses || [
          "Profile needs more project details",
          "Missing measurable achievements",
          "AI service unavailable",
        ],

        suggestions: data.suggestions || [
          "Add completed projects",
          "Highlight your client results",
          "Improve profile keywords",
        ],
      });

    } catch (error) {
      console.error(error);

      setResult({
        score: 7,

        strengths: [
          "Profile analyzed",
          "React experience is mentioned",
          "Developer background is clear",
        ],

        weaknesses: [
          "AI service unavailable",
          "More details are needed in profile",
        ],

        suggestions: [
          "Try again later",
          "Add skills and projects to your profile",
        ],
      });

    } finally {
      setLoading(false);
    }
  };


  return (
    <section>

      <h1>
        Gigora Profile Analyzer
        <span title="Analyze your freelancer profile and receive AI-powered improvement">
          ❓
        </span>
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


      <br />
      <br />


      <button
        aria-label="Analyze freelancer profile"
        onClick={analyzeProfile}
      >
        Analyze Profile
      </button>


      {loading && (
        <p>
          Analyzing...
        </p>
      )}



      {result && (

        <div>

          <h2>
            Score: {result.score}/10
          </h2>



          <h3>
            Strengths
          </h3>

          <ul>
            {result.strengths.map((item, index) => (
              <li key={index}>
                • {item}
              </li>
            ))}
          </ul>



          <h3>
            Weaknesses
          </h3>

          <ul>
            {result.weaknesses.map((item, index) => (
              <li key={index}>
                • {item}
              </li>
            ))}
          </ul>




          <h3>
            Suggestions
          </h3>

          <ul>
            {result.suggestions.map((item, index) => (
              <li key={index}>
                • {item}
              </li>
            ))}
          </ul>


        </div>

      )}


    </section>
  );
}


export default ProfileAnalyzer;
