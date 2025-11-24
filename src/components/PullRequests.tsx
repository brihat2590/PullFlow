"use client"

import { useEffect, useState } from "react"
import { GitPullRequest } from "lucide-react"
import { useSession } from "next-auth/react"

interface PullRequest {
  id: number
  number: number
  title: string
  state: "open" | "closed"
  created_at: string
  html_url: string
  user: {
    login: string
    avatar_url: string
  }
}

export default function PullRequests({
  owner,
  repo,
}: {
  owner: string
  repo: string
}) {
  const [prs, setPrs] = useState<PullRequest[]>([])
  const [loading, setLoading] = useState(true)
  const{data:session}=useSession();

  useEffect(() => {
    if(!session?.accessToken){
      return
    }
    const fetchPRs = async () => {
      try {
        setLoading(true)
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=5`, {
          headers: { Accept: "application/vnd.github.v3+json",
            Authorization: `Bearer ${session?.accessToken}`
           },
        })
        const data = await res.json()
        setPrs(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching PRs:", error)
        setPrs([])
      } finally {
        setLoading(false)
      }
    }

    fetchPRs()
  }, [owner, repo])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <div className="animate-pulse flex gap-2">
          <div className="h-2 w-2 bg-slate-500 rounded-full"></div>
          <div className="h-2 w-2 bg-slate-500 rounded-full"></div>
          <div className="h-2 w-2 bg-slate-500 rounded-full"></div>
        </div>
        <span className="text-sm">Loading PRs...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <GitPullRequest className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Open Pull Requests ({prs.length})</h3>
      </div>

      {prs.length === 0 ? (
        <p className="text-slate-400 text-sm">No open pull requests</p>
      ) : (
        <div className="space-y-3">
          {prs.map((pr) => (
            <a
              key={pr.id}
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors border border-slate-600/30 hover:border-blue-500/30 group"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-slate-200 text-sm font-medium group-hover:text-blue-300 transition-colors truncate">
                    #{pr.number} - {pr.title}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${
                      pr.state === "open" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {pr.state}
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-1">By {pr.user.login}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
