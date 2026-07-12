import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

export default function MobileDrawer({ isOpen, onClose, user, accountType, onLogout }) {
    const location = useLocation()
    const isActive = (path) => location.pathname === path

    // Listen for ESC key to close drawer
    useEffect(() => {
        if (!isOpen) return
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, onClose])

    const menuItems = [
        { label: "Dashboard", path: "/dashboard", icon: "🏦" },
        { label: "Fixed Deposits", path: "/fd", icon: "💰" },
        { label: "Cards", path: "/credit-card", icon: "💳" },
        { label: "Bank Statements", path: "/statements", icon: "📄" },
        { label: "Transactions", path: "/transactions", icon: "📜" },
        { label: "Settings", path: "/settings", icon: "⚙️" },
    ]

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`mobile-drawer-backdrop ${isOpen ? "active" : ""}`}
                onClick={onClose}
            />

            {/* Drawer Container */}
            <div className={`mobile-drawer ${isOpen ? "open" : ""}`} role="navigation">
                {/* Drawer Header */}
                <div className="mobile-drawer-header">
                    <div className="mobile-drawer-logo" onClick={() => { onClose(); window.location.href = "/dashboard"; }} style={{ cursor: "pointer" }}>
                        <img src="/underseas logo.jpeg" alt="Underseas Bank Logo" />
                        <h2>Underseas Bank</h2>
                    </div>
                    <div className="mobile-drawer-user">
                        <h3>{user?.name || "Meet Limbachiya"}</h3>
                        <p>{accountType || "Savings Account"}</p>
                    </div>
                </div>

                {/* Drawer Menu */}
                <nav className="mobile-drawer-menu">
                    {menuItems.map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.path}
                            className={`mobile-drawer-item ${isActive(item.path) ? "active" : ""}`}
                            onClick={onClose}
                        >
                            <span className="mobile-drawer-icon">{item.icon}</span>
                            <span className="mobile-drawer-label">{item.label}</span>
                        </Link>
                    ))}
                    
                    <button
                        className="mobile-drawer-item logout-btn"
                        onClick={() => {
                            onClose()
                            onLogout()
                        }}
                    >
                        <span className="mobile-drawer-icon">🚪</span>
                        <span className="mobile-drawer-label">Logout</span>
                    </button>
                </nav>
            </div>
        </>
    )
}
