import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layout/MainLayout"
import ExpenseChart from "../components/ExpenseChart"
import TransactionTable from "../components/TransactionTable"
import { getAccounts, getMyLoans, getMyFDs, getMe } from "../services/api"

export default function Dashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [accounts, setAccounts] = useState([])
    const [loanCount, setLoanCount] = useState(0)
    const [fdCount, setFdCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const loadData = async () => {
        try {
            const [accs, loans, fds, userData] = await Promise.all([
                getAccounts(),
                getMyLoans().catch(() => []),
                getMyFDs().catch(() => []),
                getMe().catch(() => null)
            ])
            setAccounts(accs)
            setLoanCount(loans.length)
            setFdCount(fds.length)
            setUser(userData)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
        const interval = setInterval(loadData, 15000)
        return () => clearInterval(interval)
    }, [])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good Morning"
        if (hour < 17) return "Good Afternoon"
        return "Good Evening"
    }

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

    const quickActions = [
        { label: "Transfer", icon: <svg viewBox="0 0 24 24"><path d="M16 3l4 4-4 4M21 7H9M8 21l-4-4 4-4M3 17h12"/></svg>, path: "/transfer" },
        { label: "Deposit", icon: <svg viewBox="0 0 24 24"><path d="M12 2v10M12 12l-4-4M12 12l4-4M2 17h20v2H2z"/></svg>, path: "/transfer" }, // Maps to Transfer page tabs
        { label: "Withdraw", icon: <svg viewBox="0 0 24 24"><path d="M12 22V12M12 12l-4 4M12 12l4 4M2 7h20V5H2z"/></svg>, path: "/transfer" },
        { label: "Accounts", icon: <svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, path: "/accounts" },
        { label: "Analytics", icon: <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, path: "/analytics" },
        { label: "Transactions", icon: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>, path: "/transactions" },
        { label: "Loans", icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>, path: "/loans" },
        { label: "Fixed Deposit", icon: <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>, path: "/fd" },
        { label: "Credit Card", icon: <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>, path: "/credit-card" },
    ]


    return (
        <MainLayout title="Dashboard">
            
            {/* Greeting */}
            <div className="greeting-section">
                <h1>{getGreeting()}, {user?.name?.split(" ")[0] || "User"} 👋</h1>
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
                {accounts.map((acc, i) => (
                    <div key={acc.id} className={`bank-card ${acc.account_type.toLowerCase()}`}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div className="bank-card-logo">Underseas Bank</div>
                                <div className="bank-card-type">{acc.account_type}</div>
                            </div>
                            <div className="bank-card-chip"></div>
                        </div>
                        <div>
                            <div className="bank-card-number">
                                •••• •••• •••• {acc.account_number.slice(-4)}
                            </div>
                            <div className="bank-card-footer">
                                <div className="bank-card-balance">
                                    <span style={{ fontSize: "11px", opacity: 0.7 }}>AVAILABLE BALANCE</span>
                                    <h2>₹{acc.balance.toLocaleString()}</h2>
                                </div>
                                <div style={{ fontSize: "12px", background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "6px" }}>
                                    Active
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Stat Summary Card for small metrics if no accounts */}
                {accounts.length === 0 && (
                    <div className="stat-card primary" style={{ height: "200px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h4>Total Balance</h4>
                        <div className="stat-value">₹0.00</div>
                        <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "10px" }}>Open an account to get started.</p>
                    </div>
                )}
            </div>

            {/* AI Insight Banner */}
            <div className="insight-banner">
                <div className="insight-content">
                    <h3>💡 Smart Financial Suggestion</h3>
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
                    {accounts.length > 0 && (
                        <TransactionTable accountId={accounts[0].id} />
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

        </MainLayout>
    )
}