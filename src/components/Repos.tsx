"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PullRequests from "./PullRequests";

export default function Repos() {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchRepos = async () => {
      const res = await fetch("https://api.github.com/user/repos", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = await res.json();
      setRepos(data);
    };

    fetchRepos();
  }, [session]);

  if (!repos.length) return <p>Loading repositories...</p>;

  return (
    <div>
      {repos.map((repo) => (
        <div key={repo.id} style={{ marginBottom: "2rem" }}>
          <h2>{repo.full_name}</h2>
          <PullRequests owner={repo.owner.login} repo={repo.name} />
        </div>
      ))}
    </div>
  );
}
