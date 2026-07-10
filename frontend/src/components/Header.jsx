import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { getMe, getAccounts, getTransactions } from "../services/api"


export default function Header({ title, subtitle, onMenuToggle }) {

    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [hasUnread, setHasUnread] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const wrapperRef = useRef(null)
    const profileRef = useRef(null)


    const loadNotifications = async () => {
        try {
            const accountsData = await getAccounts()
            const allTransactions = []
            
            await Promise.all(
                accountsData.map(async (acc) => {
                    try {
                        const txs = await getTransactions(acc.id)
                        txs.forEach(t => {
                            allTransactions.push({
                                ...t,
                                account_number: acc.account_number
                            })
                        })
                    } catch (err) {
                        console.error("Failed to fetch txs for account", acc.id, err)
                    }
                })
            )

            allTransactions.sort((a, b) => b.id - a.id)
            const recentTxs = allTransactions.slice(0, 10)

            const formatted = recentTxs.map(t => {
                const date = new Date(t.created_at || Date.now())
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
                const displayTime = `${dateStr} at ${timeStr}`

                let message = ""
                let type = t.transaction_type?.toLowerCase() || "transfer"

                if (type === "deposit") {
                    message = `Deposited ₹${t.amount.toLocaleString()} into account ending in *${t.account_number.slice(-4)}`
                } else if (type === "withdraw") {
                    message = `Withdrew ₹${t.amount.toLocaleString()} from account ending in *${t.account_number.slice(-4)}`
                } else if (type === "transfer") {
                    const isOutgoing = accountsData.some(acc => acc.id === t.from_account_id)
                    if (isOutgoing) {
                        message = `Transferred ₹${t.amount.toLocaleString()} to Account #${t.to_account_id}`
                    } else {
                        message = `Received ₹${t.amount.toLocaleString()} from Account #${t.from_account_id}`
                        type = "deposit"
                    }
                }

                return {
                    id: t.id,
                    message,
                    type,
                    time: displayTime
                }
            })

            setNotifications(formatted)
            
            const lastReadId = localStorage.getItem("lastReadNotifId")
            if (formatted.length > 0 && formatted[0].id.toString() !== lastReadId) {
                setHasUnread(true)
            }
        } catch (err) {
            console.error("Failed to load notifications", err)
        }
    }

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getMe()
                setUser(data)
            } catch (err) {
                console.log(err)
            }
        }
        queueMicrotask(() => {
            load()
            loadNotifications()
        })
        
        const interval = setInterval(loadNotifications, 20000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false)
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }


    const toggleDropdown = () => {
        setIsOpen(!isOpen)
        if (!isOpen && notifications.length > 0) {
            setHasUnread(false)
            localStorage.setItem("lastReadNotifId", notifications[0].id.toString())
        }
    }

    const markAllRead = () => {
        setHasUnread(false)
        if (notifications.length > 0) {
            localStorage.setItem("lastReadNotifId", notifications[0].id.toString())
        }
    }

    const getInitials = (name) => {
        if (!name) return "UB"
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    }

    return (

        <div className="header">

            <div className="header-left">
                <button className="hamburger-btn" onClick={onMenuToggle} aria-label="Open navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <h3>
                    <span className="desktop-title">{title || "Underseas Bank"}</span>
                    <span className="mobile-title" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
                        Underseas Bank
                    </span>
                </h3>
                {subtitle && <p className="desktop-subtitle">{subtitle}</p>}


            </div>

            <div className="header-right">

                {/* Notification Bell */}
                <div className="header-notif-wrapper" ref={wrapperRef} style={{ position: "relative" }}>
                    <div className="header-notif" onClick={toggleDropdown}>
                        <svg viewBox="0 0 24 24">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        {hasUnread && <div className="header-notif-badge"></div>}
                    </div>

                    {isOpen && (
                        <div className="notif-dropdown">
                            <div className="notif-header">
                                <h4>Updates & Activity</h4>
                                {hasUnread && (
                                    <span className="notif-clear" onClick={markAllRead}>
                                        Mark as read
                                    </span>
                                )}
                            </div>
                            <div className="notif-list">
                                {notifications.length === 0 ? (
                                    <div className="notif-empty">
                                        No recent account updates.
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div key={n.id} className="notif-item">
                                            <div className={`notif-icon ${n.type}`}>
                                                {n.type === "deposit" ? (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 13l5 5 5-5M12 18V6"/></svg>
                                                ) : n.type === "withdraw" ? (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 11l5-5 5 5M12 6v12"/></svg>
                                                ) : (
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 3l4 4-4 4M21 7H9M8 21l-4-4 4-4M3 17h12"/></svg>
                                                )}
                                            </div>
                                            <div className="notif-content">
                                                <div className="notif-message">{n.message}</div>
                                                <div className="notif-time">{n.time}</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Info with Dropdown */}
                <div className="header-user-wrapper" ref={profileRef} style={{ position: "relative" }}>
                    <div className="header-user" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} style={{ cursor: "pointer" }}>
                        <div className="header-avatar">
                            {getInitials(user?.name)}
                        </div>
                        <div className="header-user-info">
                            <p>{user?.name || "User"}</p>
                            <span>Customer</span>
                        </div>
                    </div>

                    {profileDropdownOpen && (
                        <div className="profile-dropdown">
                            <div className="profile-dropdown-header">
                                <p className="profile-name">{user?.name || "User"}</p>
                                <p className="profile-email">{user?.email || "customer@underseas.com"}</p>
                            </div>
                            <div className="profile-dropdown-item" onClick={handleLogout}>
                                <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                Sign Out
                            </div>
                        </div>
                    )}
                </div>


            </div>

        </div>

    )

}
