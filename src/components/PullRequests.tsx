"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function PullRequests({ owner, repo }: { owner: string; repo: string }) {
  const { data: session } = useSession();
  const [prs, setPrs] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    const fetchPRs = async () => {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = await res.json();
      setPrs(data);
    };

    fetchPRs();
  }, [session, owner, repo]);

  if (!prs.length) return <p>No pull requests.</p>;

  return (
    <ul>
      {prs.map((pr) => (
        <li key={pr.id}>
          <a href={pr.html_url} target="_blank">{pr.title}</a> (#{pr.number})
        </li>
      ))}
    </ul>
  );
}
