import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/login`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (data.access_token) {

        localStorage.setItem(
          "access_token",
          data.access_token
        );

        alert("Login Successful");

        navigate("/");

        window.location.reload();

      } else {

        alert(
          data.detail || "Login failed"
        );

      }

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      alert("Login error");

    }
  };


  return (

    <div
      style={{
        padding: "40px",
        maxWidth: "400px",
        margin: "auto"
      }}
    >

      <h1>
        Gigora Login
      </h1>


      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px"
        }}
      />


      <br />
      <br />


      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px"
        }}
      />


      <br />
      <br />


      <button
        onClick={login}
        style={{
          padding: "10px 25px",
          cursor: "pointer"
        }}
      >
        Login
      </button>


    </div>

  );
}


export default Login;