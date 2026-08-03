import React, { useState } from "react";

function ProposalGenerator() {

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


  const generateProposal = async () => {

    setProposalLoading(true);
    setProposalError("");
    setProposal("");


    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/proposal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            job_description: jobPost,
            tone,
            skill,
            platform,
            length,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {
        throw new Error("AI service error");
      }


      setProposal(data.text || "");
      setWordCount(data.word_count || 0);
      setKeyPoints(data.key_points || []);


    } catch (error) {


      const demoProposal = `
Hello,

I am a skilled ${skill} professional and I can help you complete this project.

I have experience creating high-quality solutions with clean work and effective communication.

I will make sure the project is completed on time according to your requirements.

I would love the opportunity to work with you.

Thank you.
`;


      setProposal(demoProposal);


      setWordCount(
        demoProposal.trim().split(/\s+/).length
      );


      setKeyPoints([
        `Experienced in ${skill}`,
        "Quality work",
        "Fast communication",
        "On-time delivery"
      ]);


      setProposalError(
        "AI service unavailable. Showing demo proposal."
      );

    }


    setProposalLoading(false);

  };


  const copyProposal = () => {

    navigator.clipboard.writeText(proposal);

    alert("Proposal copied!");

  };


  const downloadProposal = () => {

    const element = document.createElement("a");

    const file = new Blob(
      [proposal],
      {
        type: "text/plain",
      }
    );


    element.href = URL.createObjectURL(file);


    element.download =
      `proposal-${new Date().toISOString().split("T")[0]}.txt`;


    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

  };



  return (
    <section>

      <h2>
        Proposal Generator
        <span title="Generate professional proposals using AI">
          ❓
        </span>
      </h2>


      <label>
        Job Description
      </label>


      <textarea
        rows="8"
        cols="60"
        placeholder="Paste job description here..."
        value={jobPost}
        onChange={(e)=>setJobPost(e.target.value)}
      />


      <br /><br />


      <h3>Tone</h3>


      <button onClick={()=>setTone("Professional")}>
        Professional
      </button>


      <button onClick={()=>setTone("Friendly")}>
        Friendly
      </button>


      <button onClick={()=>setTone("Confident")}>
        Confident
      </button>


      <br /><br />


      <h3>Skill</h3>


      <select
        value={skill}
        onChange={(e)=>setSkill(e.target.value)}
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
        onChange={(e)=>setPlatform(e.target.value)}
      >

        <option>Upwork</option>
        <option>Fiverr</option>

      </select>


      <br /><br />


      <h3>Length</h3>


      <select
        value={length}
        onChange={(e)=>setLength(e.target.value)}
      >

        <option value="short">
          Short
        </option>

        <option value="medium">
          Medium
        </option>

        <option value="long">
          Long
        </option>

      </select>


      <br /><br />


      <button 
        aria-label="Generate AI proposal"
        onClick={generateProposal}
      >
        Generate Proposal
      </button>



      {proposalLoading && (
        <p>
          Generating proposal...
        </p>
      )}



      {proposalError && (

        <p style={{color:"orange"}}>

          {proposalError}

        </p>

      )}




      {proposal && (

        <div>


          <h3>
            Generated Proposal
          </h3>


          <p>
            {proposal}
          </p>



          <p>
            <strong>
              Word Count:
            </strong>{" "}
            {wordCount}
          </p>




          <h4>
            Key Selling Points
          </h4>


          <ul>

            {
              keyPoints.map((point,index)=>(

                <li key={index}>
                  {point}
                </li>

              ))
            }

          </ul>




          <button onClick={copyProposal}>
            Copy Proposal
          </button>



          <button onClick={downloadProposal}>
            Download Proposal
          </button>



        </div>

      )}


    </section>
  );

}


export default ProposalGenerator;
