"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Repos from "../components/Repos";

export default function Page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // User is NOT logged in → show login page
  if (!session) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem" }}>
        <h1>GitHub Dashboard</h1>
        <button
          onClick={() => signIn("github")}
          style={{
            padding: "0.5rem 1rem",
            marginTop: "2rem",
            cursor: "pointer",
          }}
        >
          Login with GitHub
        </button>
      </div>
    );
  }

  // User is logged in → show dashboard
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {session.user?.name || "GitHub User"}</h1>
      <button
        onClick={() => signOut()}
        style={{
          marginBottom: "2rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      <Repos />
    </div>
  );
}
