import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "Yasir",
    plan: "free",
  });

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/usage",
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("USAGE API DATA:", JSON.stringify(data, null, 2));

        setUser((prev) => ({
          ...prev,
          id: data.user_id,
          plan: data.plan,
        }));

      } catch (error) {
        console.error("Plan fetch error:", error);
      }
    };

    fetchUserPlan();

  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
