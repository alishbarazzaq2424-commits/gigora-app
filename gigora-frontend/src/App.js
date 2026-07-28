import React, {
  useContext,
  lazy,
  Suspense
} from "react";

import { UserContext } from "./context/UserContext";
import BetaBanner from "./BetaBanner";
import Onboarding from "./Onboarding";

const AICompare = lazy(() => import("./pages/AICompare"));
const ProfileAnalyzer = lazy(() => import("./pages/ProfileAnalyzer"));
const ProposalGenerator = lazy(() => import("./pages/ProposalGenerator"));
const SEOOptimizer = lazy(() => import("./pages/SEOOptimizer"));


function App() {

  const { user } = useContext(UserContext);

  return (
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
      </div>


      <Suspense fallback={<p>Loading...</p>}>

        <ProfileAnalyzer />

        <hr />

        <ProposalGenerator />

        <hr />

        <SEOOptimizer />

        <hr />

        <AICompare />

      </Suspense>


      <hr />

      <h2>Feedback</h2>

      <button
        onClick={() => alert("Thank you for your feedback!")}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          cursor: "pointer"
        }}
      >
        Send Feedback
      </button>


    </main>
  );
}


export default App;
