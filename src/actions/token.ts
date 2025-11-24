import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getGitHubToken(){
    const session=await getServerSession(authOptions);
    if(!session?.accessToken){
        throw new Error("No access token found in session");
    }

    return session.accessToken;
}