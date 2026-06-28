import { Navigate, Outlet } from "react-router-dom"

// Helper to decode the logged-in user's token
function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        )
        return JSON.parse(jsonPayload)
    } catch (e) {
        return null
    }
}

export default function AdminRoute() {
    const token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/Login" replace />
    }

    const user = decodeToken(token)

    // If user is not an admin, redirect them to the home page
    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />
    }

    // Render the nested admin screens
    return <Outlet />
}
