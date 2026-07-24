import React from "react";

function Onboarding() {
  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", marginTop: "20px" }}>
      <h2>Welcome to Gigora!</h2>

      <h3>Step 1</h3>
      <p>Welcome to Gigora. Let's get you started.</p>

      <h3>Step 2</h3>
      <p>Choose Your Platform:</p>

      <button>Fiverr</button>
      <button style={{ marginLeft: "10px" }}>Upwork</button>

      <h3 style={{ marginTop: "20px" }}>Step 3</h3>
      <button>Generate My First Proposal</button>
    </div>
  );
}

export default Onboarding;
