import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layout/MainLayout"
import ExpenseChart from "../components/ExpenseChart"
import TransactionTable from "../components/TransactionTable"
import BankCard from "../components/BankCard"
import { getAccounts, getMe, getOnboardingStatus, updateOnboardingStatus } from "../services/api"

export default function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeNotification, setActiveNotification] = useState(null)

    const activeAccounts = accounts.filter(acc => acc.status !== "Closed")

    const loadData = async () => {
        try {
            const accs = await getAccounts().catch(err => {
                console.error("Failed to load accounts in Dashboard:", err)
                return []
            })
            setAccounts(accs)
        } catch (err) {
            console.log(err)
        }

        try {
            const userData = await getMe().catch(err => {
                console.error("Failed to load user info in Dashboard:", err)
                return null
            })
            if (userData) {
                setUser(userData)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const checkOnboarding = async () => {
        try {
            const status = await getOnboardingStatus()
            if (!status.accountCreationNotificationShown) {
                setActiveNotification("created")
            } else if (!status.welcomeRewardNotificationShown) {
                setActiveNotification("reward")
            }
        } catch (err) {
            console.error("Failed to check onboarding:", err)
        }
    }

    useEffect(() => {
        loadData()
        checkOnboarding()
        const interval = setInterval(loadData, 15000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (activeNotification !== "created") return
        const timer = setTimeout(async () => {
            try {
                await updateOnboardingStatus("accountCreationNotificationShown")
                setActiveNotification("reward")
                loadData()
            } catch (e) {
                console.error(e)
            }
        }, 3000)
        return () => clearTimeout(timer)
    }, [activeNotification])

    const handleDismissCreated = async () => {
        try {
            await updateOnboardingStatus("accountCreationNotificationShown")
            setActiveNotification("reward")
            loadData()
        } catch (e) {
            console.error(e)
        }
    }

    const handleDismissReward = async () => {
        try {
            await updateOnboardingStatus("welcomeRewardNotificationShown")
            setActiveNotification(null)
            loadData()
        } catch (e) {
            console.error(e)
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good Morning"
        if (hour < 17) return "Good Afternoon"
        return "Good Evening"
    }

    const quickActions = [
        { label: "Transfer", icon: <svg viewBox="0 0 24 24"><path d="M16 3l4 4-4 4M21 7H9M8 21l-4-4 4-4M3 17h12"/></svg>, path: "/transfer" },
        { label: "Deposit", icon: <svg viewBox="0 0 24 24"><path d="M12 2v10M12 12l-4-4M12 12l4-4M2 17h20v2H2z"/></svg>, path: "/transfer" }, // Maps to Transfer page tabs
        { label: "Withdraw", icon: <svg viewBox="0 0 24 24"><path d="M12 22V12M12 12l-4 4M12 12l4 4M2 7h20V5H2z"/></svg>, path: "/transfer" },
        { label: "Credit Card", icon: <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>, path: "/credit-card" },
        { label: "Pay Bills", icon: <svg viewBox="0 0 24 24"><path d="M7 3h10l2 3v15l-3-2-3 2-3-2-3 2-3-2V6z" /><path d="M8 9h8M8 13h8" /></svg>, path: "/transactions" },
    ]


    return (
        <MainLayout title="Dashboard">
            
            {/* Greeting */}
            <div className="greeting-section">
                <h1>{getGreeting()}, {user?.name?.split(" ")[0] || "User"}</h1>
                <p>Ready to manage your finances today?</p>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                {quickActions.map((action, i) => (
                    <div key={i} className="quick-action-item" onClick={() => navigate(action.path)}>
                        <div className="quick-action-icon">{action.icon}</div>
                        <span>{action.label}</span>
                    </div>
                ))}
            </div>

            {/* Account Cards Grid */}
            <div className="account-cards-grid">
                {loading && activeAccounts.length === 0 && (
                    <div className="bank-card bank-card-skeleton">
                        <div className="skeleton-line wide"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line short"></div>
                    </div>
                )}

                {activeAccounts.map((acc) => {
                    const t = acc.account_type?.toLowerCase();
                    const cardType = t === "current" ? "current" : t === "salary" ? "tide" : "shoal";
                    return (
                        <BankCard
                            key={acc.id}
                            type={cardType}
                            accountType={acc.account_type}
                            balance={`₹${acc.balance.toLocaleString()}`}
                            cardNumber={`•••• •••• •••• ${acc.account_number.slice(-4)}`}
                            holderName={user?.name || "VALUED CUSTOMER"}
                        />
                    );
                })}

                {/* Stat Summary Card for small metrics if no accounts */}
                {!loading && activeAccounts.length === 0 && (
                    <div className="stat-card primary" style={{ height: "200px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h4>Total Balance</h4>
                        <div className="stat-value">₹0.00</div>
                        <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "10px" }}>Open an account to get started.</p>
                    </div>
                )}
            </div>

            {/* AI Insight Banner */}
            <div className="insight-banner">
                <div className="insight-icon">
                    <svg viewBox="0 0 24 24"><path d="M12 2v20M4 8h16M6 16h12" /></svg>
                </div>
                <div className="insight-content">
                    <h3>Smart Financial Suggestion</h3>
                    <p>
                        Your current balance is among the top 10% of users this month. 
                        Consider moving <strong>₹5,000</strong> to a Fixed Deposit to earn up to <strong>7.5% APY</strong>.
                    </p>
                </div>
                <div className="insight-cta" onClick={() => navigate("/fd")}>
                    Explore FD Options
                </div>
            </div>

            {/* Secondary Stats & Charts */}
            <div className="grid-2">
                <div className="panel" style={{ padding: "0" }}>
                    <div className="panel-header" style={{ padding: "24px 24px 0" }}>
                        <h3>Recent Transactions</h3>
                        <span className="view-all" onClick={() => navigate("/transactions")}>View All</span>
                    </div>
                    {activeAccounts.length > 0 && (
                        <TransactionTable accountId={activeAccounts[0].id} />
                    )}
                </div>

                <div className="chart-box">
                    <div className="panel-header">
                        <h3>Spending Habits</h3>
                        <span className="badge badge-info">Monthly</span>
                    </div>
                    <ExpenseChart />
                </div>
            </div>
            {/* Onboarding Modals */}
            {activeNotification === "created" && (
                <div className="onboarding-modal-overlay">
                    <div className="onboarding-modal-card">
                        <span className="onboarding-modal-icon">🎉</span>
                        <h2>Savings Account Created</h2>
                        <p>
                            Your Underseas Bank Savings Account has been successfully created.<br />
                            An Initial Account Opening Deposit of ₹1,000 has been credited to activate your account.
                        </p>
                        <button className="onboarding-modal-button" onClick={handleDismissCreated}>
                            View Account
                        </button>
                    </div>
                </div>
            )}

            {activeNotification === "reward" && (
                <div className="onboarding-modal-overlay">
                    <div className="onboarding-modal-card">
                        <span className="onboarding-modal-icon">🎁</span>
                        <h2>Welcome Reward Received</h2>
                        <p>
                            Thank you for choosing Underseas Bank.<br />
                            ₹100 has been credited to your Savings Account as a Welcome Reward.<br />
                            Enjoy banking with Underseas Bank!
                        </p>
                        <button className="onboarding-modal-button" onClick={handleDismissReward}>
                            Awesome!
                        </button>
                    </div>
                </div>
            )}

        </MainLayout>
    )
}
