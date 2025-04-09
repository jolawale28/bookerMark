"use client";

import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const router = useRouter();

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // router.push("/dashboard"); // Redirect after successful sign-in
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    return (
        <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogle}
            fullWidth
        >
            Sign in with Google
        </Button>
    );
}