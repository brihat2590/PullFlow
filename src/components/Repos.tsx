"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import PullRequests from "./PullRequests"
import { Code2, GitFork, Eye, Star } from "lucide-react"

export default function Repos() {
  const { data: session } = useSession()
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.accessToken) return

    const fetchRepos = async () => {
      setLoading(true)
      try {
        const res = await fetch("https://api.github.com/user/repos?sort=updated&direction=desc", {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        })
        const data = await res.json()
        if (Array.isArray(data)) {
            setRepos(data)
        } else {
            setRepos([])
        }
      } catch (error) {
        console.error("Failed to fetch repos", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [session])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-blue-500"></div>
          </div>
          <p className="mt-6 text-slate-300 text-lg font-medium">Loading repositories...</p>
          <p className="mt-2 text-slate-500 text-sm">Fetching your GitHub data</p>
        </div>
      </div>
    )
  }

  if (!repos.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
        <div className="text-center">
          <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 text-lg font-medium">No repositories found</p>
          <p className="mt-2 text-slate-500 text-sm">Create a repository to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3  ">
                <Code2 className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-italic text-white tracking-tight ">Your Repositories</h1>
          </div>
          <p className="text-slate-400 font-italic text-lg ml-1">Manage and review your GitHub projects</p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-400">
            <span>Total repositories:</span>
            <span className="ml-2 text-white font-semibold">{repos.length}</span>
          </div>
        </div>

        <div className="space-y-6">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="group bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all duration-300 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-blue-500/5 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2.5 shadow-[0_0_8px_rgba(52,211,153,0.5)] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-bold text-white hover:text-blue-400 transition-colors truncate group-hover:text-blue-400 flex items-center gap-2"
                      >
                        {repo.name}
                        <span className="text-slate-500 font-normal text-base">/ {repo.owner.login}</span>
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap border ${
                        repo.private
                          ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                      }`}
                    >
                      {repo.private ? "Private" : "Public"}
                    </span>
                    {repo.language && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>

                {repo.description && (
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 pl-6">
                    {repo.description}
                  </p>
                )}
              </div>

              <div className="px-6 py-3 bg-slate-900/80 flex flex-wrap gap-6 text-sm border-b border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors cursor-default">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">{repo.stargazers_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-default">
                  <GitFork className="w-4 h-4" />
                  <span className="font-medium">{repo.forks_count.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors cursor-default">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">{repo.watchers_count.toLocaleString()}</span>
                </div>
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-auto">
                    {repo.topics.slice(0, 3).map((topic: string) => (
                      <span key={topic} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-900/30">
                <PullRequests owner={repo.owner.login} repo={repo.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}