"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";
import { marked } from "marked";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { reviewPullRequest } from "@/actions/pullrequest";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  owner: z.string().min(1, "Repository owner is required"),
  repo: z.string().min(1, "Repository name is required"),
  prNumber: z.coerce
    .number()
    .int("PR number must be an integer")
    .positive("PR number must be positive"),
});

export function ReviewForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      owner: "",
      repo: "",
      prNumber: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFeedback(null);
    setError(null);

    try {
      const result = await reviewPullRequest(values);
      if (result.error) {
        setError(result.error);
      } else {
        setFeedback(result.feedback!);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto " >

        <h1 className="mt-5 pt-5 text-center bg-linear-to-r from-neutral-300 to-neutral-500 text-transparent bg-clip-text text-4xl"> AI PR review </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">

            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Owner</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: Brihat" {...field} />
                  </FormControl>
                  <FormDescription>
                    The GitHub username or organization
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg: MyRepo" {...field} />
                  </FormControl>
                  <FormDescription>The name of the repository</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="prNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pull Request Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 123"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  The number of the pull request to review
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing PR...
              </>
            ) : (
              "Review Pull Request"
            )}
          </Button>
        </form>
      </Form>

      {error && (
        <Card className="border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </Card>
      )}

{feedback && (
  <div className="rounded-xl border p-6 shadow-sm dark:border-gray-800 pt-10 dark:bg-gray-900 max-w-7xl mx-auto">
    <h2 className="mb-4 text-center text-4xl  bg-gradient-to-r from-neutral-300 to-neutral-500 bg-clip-text text-transparent pb-5">
      AI Review Feedback
    </h2>

    {/* Styled Markdown Renderer */}
    <div className="prose not-last:text-lg dark:prose-invert max-w-none leading-relaxed text-neutral-300 px-2">
    <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    p: ({node, ...props}) => <p className="mb-6" {...props} />
  }}
>
  {feedback.split('\n').map(line => line.trim()).filter(Boolean).join('\n\n')}
</ReactMarkdown>
    </div>
  </div>
)}
    </div>
  );
}
