"use server";

import { z } from "zod";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
// import { getServerSession } from "next-auth/next";
// import {authOptions} from "@/app/api/auth/[...nextauth]/route"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { getGitHubToken } from "./token";

// Define Zod schema for the form input
const reviewInputSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  prNumber: z.number().int().positive(),
});

// Define Zod schema for the state
const stateSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  prNumber: z.number(),
  diff: z.string().optional(),
  feedback: z.string().optional(),
});

type ReviewState = z.infer<typeof stateSchema>;

// Fetch GitHub PR diff
async function fetchPullRequestDiff(state: ReviewState): Promise<ReviewState> {
  const url = `https://api.github.com/repos/${state.owner}/${state.repo}/pulls/${state.prNumber}`;
  const token=await getGitHubToken();

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3.diff",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    const diff = await response.text();
    return { ...state, diff };
  } catch (error) {
    console.error("Error fetching PR diff:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch the pull request diff"
    );
  }
}

// Analyze PR with Vercel AI Gemini
async function analyzeDiff(state: ReviewState): Promise<ReviewState> {
  if (!state.diff) throw new Error("No diff to analyze");

  try {
    const prompt = `You are an expert AI code reviewer. Review the following GitHub pull request diff:

\`\`\`diff
${state.diff}
\`\`\`

Give categorized feedback on Style, Security, Performance, and Design. Format your response in Markdown.`;

    const { text } = await generateText({
      model: google("gemini-2.5-flash"), // Gemini model via Vercel AI
      prompt,
    });

    return { ...state, feedback: text };
  } catch (error) {
    console.error("Error analyzing diff with Gemini:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to analyze the pull request"
    );
  }
}

// Main server action
export async function reviewPullRequest(
  input: z.infer<typeof reviewInputSchema>
) {
  try {
    const validatedInput = reviewInputSchema.parse(input);

    const initialState: ReviewState = {
      owner: validatedInput.owner,
      repo: validatedInput.repo,
      prNumber: validatedInput.prNumber,
    };

    const stateWithDiff = await fetchPullRequestDiff(initialState);
    const reviewedState = await analyzeDiff(stateWithDiff);

    // Post feedback to GitHub
    await postPRComment(reviewedState);

    return {
      feedback: reviewedState.feedback,
    };
  } catch (error) {
    console.error("PR review error:", error);
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// Post feedback as GitHub comment
async function postPRComment(state: ReviewState): Promise<void> {
  const url = `https://api.github.com/repos/${state.owner}/${state.repo}/issues/${state.prNumber}/comments`;

  // const session=await getServerSession(authOptions);
  // if(!session?.accessToken){
  //   throw new Error("No access token found in session");
  // }
  const token=await getGitHubToken();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: state.feedback,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to post comment: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error posting comment to GitHub:", error);
    throw new Error("Could not post comment to GitHub");
  }
}
