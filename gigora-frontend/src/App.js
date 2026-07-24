import React, { useState, useContext } from "react";
import { UserContext } from "./context/UserContext";
import BetaBanner from "./BetaBanner";
import Onboarding from "./Onboarding";

function App() {
  const { user } = useContext(UserContext);
  const [profileText, setProfileText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [jobPost, setJobPost] = useState("");
  const [proposal, setProposal] = useState("");
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalError, setProposalError] = useState("");

  const [tone, setTone] = useState("Professional");
const [skill, setSkill] = useState("Web Dev");
const [platform, setPlatform] = useState("Upwork");
const [length, setLength] = useState("medium");

const [wordCount, setWordCount] = useState(0);
const [keyPoints, setKeyPoints] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [seoResult, setSeoResult] = useState("");

  const analyzeProfile = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile_text: profileText,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to analyze profile");
    }

    setLoading(false);
  };

  const generateProposal = async () => {
    setProposalLoading(true);
    setProposalError("");
    setProposal("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jobPost,
          tone,
          skill,
          platform,
          length
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("AI service quota exceeded. Please try again later.");
      }

      setProposal(data.text);
      setWordCount(data.word_count || 0);
      setKeyPoints(data.key_points || []);
    } catch (error) {
      setProposalError("AI service quota exceeded. Please try again later.");
    }

    setProposalLoading(false);
  };

  const copyProposal = () => {
    navigator.clipboard.writeText(proposal);
    alert("Proposal copied to clipboard!");
  };

  const downloadProposal = () => {
  const element = document.createElement("a");

  const file = new Blob([proposal], {
    type: "text/plain"
  });

  element.href = URL.createObjectURL(file);

  element.download =
    `proposal-${new Date().toISOString().split("T")[0]}.txt`;

  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

  const optimizeSEO = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          category: category,
        }),
      });

      const data = await response.json();
      setSeoResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to optimize SEO");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "100%" }}>
      <BetaBanner/>
      <Onboarding />
      
      <div style={{
        padding: "10px",
        marginBottom: "20px",
        borderBottom: "1px solid #ccc",
      }}
      >
        <strong>Logged in as:</strong>
      {user.username}
      </div>
      <h1>Gigora Profile Analyzer</h1>

      <textarea
        rows="8"
        style={{ width: "100%", maxWidth: "100"}}
        placeholder="Paste profile description here..."
        value={profileText}
        onChange={(e) => setProfileText(e.target.value)}
      />

      <br />
      <br />

      <button onClick={analyzeProfile}>
        Analyze Profile
      </button>

      {loading && <p>Analyzing...</p>}

      {result && (
        <div>
          <h2>Score: {result.score}/10</h2>

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

      <hr />

      <h1>Proposal Generator</h1>

      <textarea
        rows="8"
        cols="60"
        placeholder="Paste job description here..."
        value={jobPost}
        onChange={(e) => setJobPost(e.target.value)}
      />

      <br />
      <br />

       <h3>Tone</h3>

<button
  onClick={() => setTone("Professional")}
  style={{
    backgroundColor: tone === "Professional" ? "#7c3aed" : "#ddd",
    color: tone === "Professional" ? "white" : "black",
    marginRight: "5px",
    padding: "8px 12px"
  }}
>
  Professional
</button>

<button
  onClick={() => setTone("Friendly")}
  style={{
    backgroundColor: tone === "Friendly" ? "#7c3aed" : "#ddd",
    color: tone === "Friendly" ? "white" : "black",
    marginRight: "5px",
    padding: "8px 12px"
  }}
>
  Friendly
</button>

<button
  onClick={() => setTone("Confident")}
  style={{
    backgroundColor: tone === "Confident" ? "#7c3aed" : "#ddd",
    color: tone === "Confident" ? "white" : "black",
    padding: "8px 12px"
  }}
>
  Confident
</button>

<br /><br />

<h3>Skill</h3>

<select
  value={skill}
  onChange={(e) => setSkill(e.target.value)}
>
  <option>Web Dev</option>
  <option>Graphic Design</option>
  <option>Writing</option>
  <option>Marketing</option>
  <option>Mobile Dev</option>
  <option>AI/ML</option>
  <option>Other</option>
</select>

<br /><br />

<h3>Platform</h3>

<select
  value={platform}
  onChange={(e) => setPlatform(e.target.value)}
>
  <option>Upwork</option>
  <option>Fiverr</option>
</select>

<br /><br />

<h3>Length</h3>

<select
  value={length}
  onChange={(e) => setLength(e.target.value)}
>
  <option value="short">Short</option>
  <option value="medium">Medium</option>
  <option value="long">Long</option>
</select>

<br /><br />

      <button onClick={generateProposal}>
        Generate Proposal
      </button>

      {proposalLoading && <p>Generating proposal...</p>}

      {proposalError && (
        <p style={{ color: "red" }}>
          {proposalError}
        </p>
      )}

      {proposal && (
        <div>
          <h3>Generated Proposal</h3>

          <p>{proposal}</p>
           <p>
  <strong>Word Count:</strong> {wordCount}
</p>

<h4>Key Selling Points</h4>

<div>
  {keyPoints.map((point, index) => (
    <span
      key={index}
      style={{
        display: "inline-block",
        backgroundColor: "#22c55e",
        color: "white",
        padding: "6px 12px",
        margin: "5px",
        borderRadius: "20px"
      }}
    >
      {point}
    </span>
  ))}
</div>


          <button
  onClick={copyProposal}
  style={{
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px"
  }}
>
  Copy Proposal
</button>
          <br />
<br />

<button
  onClick={downloadProposal}
  style={{
    backgroundColor: "#16a34a",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    marginLeft: "10px"
  }}
>
  Download Proposal
</button>
        </div>
      )}

      <hr />

      <h1>SEO Optimizer</h1>

      <input
        type="text"
        placeholder="Gig Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "500px" }}
      />

      <p style={{
        color: title.length > 80 ?
      "red" : "green"
      }}>
        {title.length}/80 characters
      </p>

      <br />
      <br />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) =>
      setCategory(e.target.value)}
        style={{ width: "500px"}}
      />

      <br />
      <br />


      <textarea
        rows="6"
        cols="60"
        placeholder="Gig Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <button onClick={optimizeSEO}>
        Optimize SEO
      </button>

      {seoResult && (
        <div>
          <h3>Optimized Content</h3>
        <pre>{JSON.stringify(seoResult, null, 2)}</pre>
          {seoResult.tags && (
            <>
             <h4>Tags</h4>

             <ul>
              {seoResult.tags.map((tag, index) => (
                <li key={index}>
                  {tag.text} -
                  {tag.valid ? "✅ Valid" : "❌ Invalid"}
                </li>
              ))}
             </ul>
            </>
          )}
          <p><strong> Title:</strong>{seoResult.optimized_title}</p>
          <p><strong> Description:</strong>{seoResult.optimized_description}</p>

          {seoResult.scores && (
            <>
             <h4>SEO Scores</h4>
             <p>Title Score: {seoResult.scores.title}</p>
             <p>Tag Score: {seoResult.scores.tags}</p>
             <p>Description Score: {seoResult.scores.description}</p>
             <p>Overall Score: {seoResult.scores.overall}</p>
            </>
          )}

          {seoResult.tips &&(
            <>
             <h4>SEO Tips</h4>
             <ul>
              {seoResult.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
             </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
