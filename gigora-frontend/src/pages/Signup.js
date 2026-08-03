import React, { useState } from "react";

function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {

      const response = await fetch(
        "http://127.0.0.1:8000/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("SIGNUP RESPONSE:", data);

      alert("Signup successful");

    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed");
    }
  };


  return (
    <div style={{padding:"30px"}}>

      <h1>Create Account</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        style={{
          display:"block",
          padding:"10px",
          marginBottom:"10px",
          width:"300px"
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        style={{
          display:"block",
          padding:"10px",
          marginBottom:"10px",
          width:"300px"
        }}
      />


      <button
        onClick={signup}
        style={{
          padding:"10px 20px",
          cursor:"pointer"
        }}
      >
        Signup
      </button>

    </div>
  );
}

export default Signup;
