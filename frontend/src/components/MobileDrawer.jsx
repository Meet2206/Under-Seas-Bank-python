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

    const sections = [
        {
            title: "Main",
            items: [
                {
                    label: "Dashboard",
                    path: "/dashboard",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                    )
                },
                {
                    label: "Accounts",
                    path: "/accounts",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" />
                            <path d="M16 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V2" />
                        </svg>
                    )
                },
                {
                    label: "Analytics",
                    path: "/analytics",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: "Banking",
            items: [
                {
                    label: "Transfer",
                    path: "/transfer",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    )
                },
                {
                    label: "Transactions",
                    path: "/transactions",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: "Products",
            items: [
                {
                    label: "Loans",
                    path: "/loans",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                    )
                },
                {
                    label: "Fixed Deposits",
                    path: "/fd",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <path d="M12 12h.01" />
                            <path d="M17 12h.01" />
                            <path d="M7 12h.01" />
                        </svg>
                    )
                },
                {
                    label: "Credit Card",
                    path: "/credit-card",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                    )
                }
            ]
        },
        {
            title: null,
            items: [
                {
                    label: "Bank Statements",
                    path: "/statements",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                    )
                },
                {
                    label: "Settings",
                    path: "/settings",
                    icon: (
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    )
                }
            ]
        }
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
                    {sections.map((section, sIdx) => (
                        <div key={sIdx} style={{ display: "contents" }}>
                            {section.title && <div className="mobile-drawer-section-label">{section.title}</div>}
                            {section.title === null && <div className="mobile-drawer-separator" />}
                            {section.items.map((item, idx) => (
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
                        </div>
                    ))}
                    
                    <button
                        className="mobile-drawer-item logout-btn"
                        onClick={() => {
                            onClose()
                            onLogout()
                        }}
                    >
                        <span className="mobile-drawer-icon">
                            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        </span>
                        <span className="mobile-drawer-label">Logout</span>
                    </button>
                </nav>
            </div>
        </>
    )
}
