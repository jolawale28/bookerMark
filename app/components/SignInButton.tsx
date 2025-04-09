"use client";

import { Button } from "@mui/material";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignInButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            router.push("/"); // Redirect to home after sign out
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <Button variant="outlined" onClick={handleSignOut}>
            Sign Out
        </Button>
    );
}