import {
  Routes,
  Route
} from "react-router-dom";

import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Navigate } from "react-router-dom";
import { supabase } from "./supabase";
import { logError } from "./errorLogger";

import React, {
  useContext,
  lazy,
  Suspense
} from "react";

import { UserContext } from "./context/UserContext";

const BetaBanner = lazy(() => import("./BetaBanner"));
const Onboarding = lazy(() => import("./Onboarding"));

const AICompare = lazy(() => import("./pages/AICompare"));
const ProfileAnalyzer = lazy(() => import("./pages/ProfileAnalyzer"));
const ProposalGenerator = lazy(() => import("./pages/ProposalGenerator"));
const SEOOptimizer = lazy(() => import("./pages/SEOOptimizer"));


function App() {

  const token = localStorage.getItem("access_token");

  const [feedback, setFeedback] = React.useState("");
  const [showFeedback, setShowFeedback] = React.useState(false);

  const { user } = useContext(UserContext);

    React.useEffect(() => {

    const handleError = (event) => {
      logError(event.error, user?.id);
    };

    window.addEventListener(
      "error",
      handleError
    );

    return () => {
      window.removeEventListener(
        "error",
        handleError
      );
    };

  }, [user]);

  console.log("CURRENT USER:", user);

  const upgradeToPro = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/payment/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Stripe Response:", data);

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.detail || "Checkout URL not received");
      }

    } catch (error) {
      console.error(error);
      alert("Payment error");
    }
  };


  const submitFeedback = async () => {

    if (!feedback.trim()) {
      alert("Please enter feedback");
      return;
    }


    const { error } = await supabase
      .from("feedback")
      .insert([
        {
          user_id: user.id,
          type: "feedback",
          message: feedback,
          page_url: window.location.pathname,
          browser_info: navigator.userAgent,
          status: "new"
        }
      ]);


    if (error) {

      console.error(error);
      alert("Feedback failed");

    } else {

      alert("Thank you for your feedback!");
      setFeedback("");
      setShowFeedback(false);

    }

  };


  return (
    <Routes>


      <Route
        path="/payment-success"
        element={<PaymentSuccess />}
      />


      <Route
        path="/payment-cancel"
        element={<PaymentCancel />}
      />


      <Route
        path="/login"
        element={<Login />}
      />


      <Route
        path="/signup"
        element={<Signup />}
      />


      <Route
        path="/"
        element={
          token ? (

            <main style={{ padding: "20px", maxWidth: "100%" }}>

              <BetaBanner />

              <Onboarding />


              <div
                style={{
                  padding: "10px",
                  marginBottom: "20px",
                  borderBottom: "1px solid #ccc",
                }}
              >

                <strong>Logged in as:</strong> {user.username}


                <button
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    window.location.reload();
                  }}
                  style={{
                    padding: "10px 20px",
                    marginTop: "10px",
                    cursor: "pointer"
                  }}
                >
                  Logout
                </button>


              </div>


              <Suspense fallback={<p>Loading...</p>}>

                <ProfileAnalyzer />

                <hr />

                <ProposalGenerator />

                <hr />

                <SEOOptimizer />

                <hr />


                {user.plan === "pro" ? (

                  <AICompare />

                ) : (

                  <p>
                    🔒 AI Compare is a Pro feature. Upgrade to unlock.
                  </p>

                )}


              </Suspense>


              <hr />


              <h2>Subscription</h2>


              {user.plan === "pro" ? (

                <p>
                  🎉 You are a Pro Member
                </p>

              ) : (

                <button
                  onClick={upgradeToPro}
                  style={{
                    padding: "10px 20px",
                    marginTop: "20px",
                    cursor: "pointer"
                  }}
                >
                  Upgrade to Pro 🚀
                </button>

              )}



              <h2>Feedback</h2>


              <button
                onClick={() => setShowFeedback(true)}
                style={{
                  padding: "10px 20px",
                  marginTop: "20px",
                  cursor: "pointer"
                }}
              >
                Send Feedback
              </button>



              {showFeedback && (

                <div style={{ marginTop: "15px" }}>


                  <textarea

                    value={feedback}

                    onChange={(e) => setFeedback(e.target.value)}

                    placeholder="Write your feedback..."

                    rows="4"

                    style={{
                      width: "300px",
                      padding: "10px"
                    }}

                  />


                  <br />


                  <button

                    onClick={submitFeedback}

                    style={{
                      padding: "10px 20px",
                      marginTop: "10px",
                      cursor: "pointer"
                    }}

                  >
                    Submit Feedback
                  </button>


                </div>

              )}


            </main>


          ) : (

            <Navigate to="/login" />

          )

        }
      />


    </Routes>
  );
}


export default App;
