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
      const res = await fetch("https://api.github.com/user/repos?sort=updated&direction=desc", {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const data = await res.json();
      setRepos(data);
    };

    fetchRepos();
  }, [session]);

  if (!repos.length) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading repositories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Repositories</h1>
          <p className="text-gray-400">Manage and review your GitHub repositories</p>
        </div>
        
        <div className="space-y-6">
          {repos.map((repo) => (
            <div 
              key={repo.id} 
              className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer">
                    {repo.full_name}
                  </h2>
                </div>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                  {repo.private ? "Private" : "Public"}
                </span>
              </div>
              
              {repo.description && (
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {repo.description}
                </p>
              )}
              
              <div className="flex items-center space-x-6 text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <span>⭐</span>
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🍴</span>
                  <span>{repo.forks_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>👀</span>
                  <span>{repo.watchers_count}</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <PullRequests owner={repo.owner.login} repo={repo.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}