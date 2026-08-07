import React, { useEffect, useState } from "react";

function PaymentSuccess() {

  const [status, setStatus] = useState("Checking payment...");

  useEffect(() => {

    const checkPlan = async () => {

      try {

        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "https://gigora-backend-production.up.railway.app/api/usage",
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("PLAN STATUS:", data);

        if (data.plan === "pro") {
          setStatus("Your Gigora Pro subscription is active 🎉");
        } else {
          setStatus(
            "Payment received. Activating your Pro plan..."
          );
        }

      } catch (error) {
        console.error(error);
        setStatus("Unable to verify payment");
      }

    };

    checkPlan();

  }, []);


  return (
    <div style={{ padding:"40px", textAlign:"center" }}>

      <h1>
        Payment Successful 🎉
      </h1>

      <p>
        {status}
      </p>

      <a href="/">
        Go to Dashboard
      </a>

    </div>
  );
}

export default PaymentSuccess;
