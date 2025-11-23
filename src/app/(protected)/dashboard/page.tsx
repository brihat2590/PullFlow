"use client"
import { signOut } from "next-auth/react"
import { toast } from "sonner";

export default function page(){
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/login' });
        toast.success('Logged out successfully');

    }
    return(
        <div>
            this is the dashboard page


            <div onClick={handleLogout}>
                logout
            </div>
        </div>
    )
}