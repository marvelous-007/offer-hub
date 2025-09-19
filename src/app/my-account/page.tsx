"use client"

import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import AccountSettings from "./account-settings-client"
import { useEffect } from "react"

export default function Page() {


    // This will be handled by the auth and stored in the backend
    useEffect(() => {
        localStorage.setItem("roles", JSON.stringify(["admin"]));
    }, [])


    return (
        // This page is protected and set to only admin access
        <ProtectedRoute roles={["admin"]} >
            <AccountSettings />
        </ProtectedRoute>
    )
}
