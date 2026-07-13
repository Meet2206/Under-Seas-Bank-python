import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MainLayout from "../layout/MainLayout"
import { getAccounts, createAccount, validateAccountClosure, closeAccount } from "../services/api"

export default function Accounts() {
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([])
    const [accountType, setAccountType] = useState("Savings")
    const [loading, setLoading] = useState(true)

    // Selection & Closure States
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [closureValidation, setClosureValidation] = useState(null)
    const [showValidationFailModal, setShowValidationFailModal] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [closureReason, setClosureReason] = useState("")
    const [isClosing, setIsClosing] = useState(false)

    const loadAccounts = async () => {
        try {
            const data = await getAccounts()
            setAccounts(data)
            // If the currently selected account is updated, sync it
            if (selectedAccount) {
                const updated = data.find(a => a.id === selectedAccount.id)
                setSelectedAccount(updated || null)
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAccounts()
    }, [])

    const handleCreate = async () => {
        try {
            await createAccount(accountType)
            alert("Account created successfully!")
            loadAccounts()
        } catch (err) {
            alert(err.message)
        }
    }

    const handleCloseAccountInitiation = async (acc) => {
        setLoading(true)
        try {
            const validation = await validateAccountClosure(acc.id)
            setClosureValidation(validation)
            if (validation.canClose) {
                setClosureReason("")
                setShowConfirmModal(true)
            } else {
                setShowValidationFailModal(true)
            }
        } catch (err) {
            alert(err.message || "Failed to validate account closure.")
        } finally {
            setLoading(false)
        }
    }

    const handleFinalClose = async () => {
        if (!selectedAccount) return
        setIsClosing(true)
        try {
            await closeAccount(selectedAccount.id, closureReason)
            setShowConfirmModal(false)
            setShowSuccessModal(true)
            setSelectedAccount(null)
            loadAccounts()
        } catch (err) {
            alert(err.message || "Failed to close account.")
        } finally {
            setIsClosing(false)
        }
    }

    const activeAccounts = accounts.filter(a => a.status !== "Closed")
    const archivedAccounts = accounts.filter(a => a.status === "Closed")

    return (
        <MainLayout title="My Accounts" subtitle="Manage your various bank accounts and balances">
            <div className="grid-2-1">
                <div className="panel">
                    <div className="panel-header">
                        <h3>Active Bank Accounts</h3>
                        <span className="view-all">{activeAccounts.length} Active</span>
                    </div>

                    {loading && accounts.length === 0 ? (
                        <p className="loading-text">Loading your accounts...</p>
                    ) : activeAccounts.length === 0 ? (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            <p>No active accounts found. Open a new account to get started.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {activeAccounts.map((acc) => (
                                <div 
                                    key={acc.id} 
                                    className={`stat-card ${selectedAccount?.id === acc.id ? 'active' : ''}`} 
                                    onClick={() => setSelectedAccount(acc)}
                                    style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "space-between", 
                                        padding: "20px",
                                        cursor: "pointer",
                                        border: selectedAccount?.id === acc.id ? "1.5px solid var(--teal-400)" : "1px solid rgba(255,255,255,0.06)",
                                        background: selectedAccount?.id === acc.id ? "rgba(92,235,216,0.05)" : "",
                                        transition: "all 0.25s ease"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div className="stat-card-icon blue">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                                <line x1="2" y1="10" x2="22" y2="10" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 style={{ marginBottom: "0", color: "var(--gray-900)", fontSize: "14px", fontWeight: "600" }}>{acc.account_type} Account</h4>
                                            <span style={{ fontSize: "12px", color: "var(--gray-400)" }}>{acc.account_number}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div className="stat-value" style={{ fontSize: "20px" }}>₹{acc.balance.toLocaleString()}</div>
                                        <span className="badge badge-success">Active</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Archived/Closed Accounts Section */}
                    {archivedAccounts.length > 0 && (
                        <div style={{ marginTop: "40px" }}>
                            <div className="panel-header" style={{ marginBottom: "16px" }}>
                                <h3 style={{ color: "var(--gray-500)", fontSize: "15px" }}>Archived / Closed Accounts</h3>
                                <span className="view-all" style={{ color: "var(--gray-400)" }}>{archivedAccounts.length} Closed</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", opacity: 0.65 }}>
                                {archivedAccounts.map((acc) => (
                                    <div 
                                        key={acc.id} 
                                        className="stat-card" 
                                        style={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "space-between", 
                                            padding: "20px",
                                            border: "1px dashed rgba(239, 68, 68, 0.25)",
                                            background: "rgba(239,68,68,0.01)"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                            <div className="stat-card-icon" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                                    <line x1="2" y1="10" x2="22" y2="10" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 style={{ marginBottom: "0", color: "var(--gray-500)", fontSize: "14px", fontWeight: "600" }}>{acc.account_type} Account</h4>
                                                <span style={{ fontSize: "12px", color: "var(--gray-400)" }}>{acc.account_number}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div className="stat-value" style={{ fontSize: "20px", color: "var(--gray-400)" }}>₹{acc.balance.toLocaleString()}</div>
                                            <span className="badge badge-danger">Closed</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Details / Management Sidebar */}
                <div className="form-section">
                    {selectedAccount ? (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <h3>Account Management</h3>
                                <button 
                                    onClick={() => setSelectedAccount(null)} 
                                    style={{ 
                                        background: "transparent", 
                                        border: "none", 
                                        color: "var(--gray-400)", 
                                        fontSize: "20px", 
                                        cursor: "pointer", 
                                        padding: "4px" 
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                            <div className="stat-card" style={{ marginBottom: "24px", padding: "16px" }}>
                                <div style={{ fontSize: "11px", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Selected Account</div>
                                <div style={{ fontWeight: "700", color: "var(--navy-900)", fontSize: "15px", marginTop: "4px" }}>{selectedAccount.account_type} Account</div>
                                <div style={{ fontSize: "12px", fontFamily: "monospace", color: "var(--gray-500)", marginTop: "2px" }}>{selectedAccount.account_number}</div>
                            </div>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <button className="btn-secondary" onClick={() => alert("Freeze Account option coming soon")} style={{ width: "100%", justifyContent: "flex-start", padding: "12px 16px" }}>
                                    ❄️ Freeze Account (Coming Soon)
                                </button>
                                <button className="btn-secondary" onClick={() => navigate("/statements")} style={{ width: "100%", justifyContent: "flex-start", padding: "12px 16px" }}>
                                    📄 Download Statement
                                </button>
                                {selectedAccount.status !== "Closed" && (
                                    <button 
                                        className="btn-danger-outline" 
                                        onClick={() => handleCloseAccountInitiation(selectedAccount)}
                                    >
                                        Close Account
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>Open New Account</h3>
                            <div className="form-field">
                                <label>Account Type</label>
                                <select
                                    value={accountType}
                                    onChange={(e) => setAccountType(e.target.value)}
                                >
                                    <option value="Savings">Savings Account</option>
                                    <option value="Current">Current Account</option>
                                    <option value="Salary">Salary Account</option>
                                </select>
                            </div>
                            <button onClick={handleCreate} style={{ width: "100%", justifyContent: "center" }}>
                                Create Account
                            </button>
                            
                            <div style={{ marginTop: "24px", padding: "16px", background: "var(--info-bg)", borderRadius: "var(--border-radius-xs)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                                <p style={{ fontSize: "12px", color: "var(--info)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                    Did you know?
                                </p>
                                <p style={{ fontSize: "12px", color: "var(--gray-600)", marginTop: "4px", lineHeight: "1.4" }}>
                                    Savings accounts earn a 4.5% annual interest rate, paid out monthly.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Validation Fail Modal */}
            {showValidationFailModal && (
                <div className="onboarding-modal-overlay">
                    <div className="luxury-modal-card" style={{ maxWidth: "460px" }}>
                        <span className="onboarding-modal-icon" style={{ fontSize: "36px" }}>⚠️</span>
                        <h2>Unable to Close Account</h2>
                        <p className="modal-message-body" style={{ marginTop: "8px" }}>
                            Please resolve the following before closing your account:
                        </p>
                        <ul className="closure-reasons-list">
                            {closureValidation?.reasons.map((reason, idx) => (
                                <li key={idx}>{reason}</li>
                            ))}
                        </ul>
                        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                            <button className="btn-secondary-outline" onClick={() => setShowValidationFailModal(false)}>
                                Cancel
                            </button>
                            <button className="onboarding-modal-button" style={{ margin: 0 }} onClick={() => setShowValidationFailModal(false)}>
                                Manage Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="onboarding-modal-overlay">
                    <div className="luxury-modal-card" style={{ maxWidth: "460px" }}>
                        <span className="onboarding-modal-icon" style={{ fontSize: "36px" }}>❓</span>
                        <h2>Close Savings Account?</h2>
                        <div className="modal-message-body" style={{ textAlign: "left", margin: "16px 0" }}>
                            <p>Closing your Savings Account is permanent.</p>
                            <p style={{ marginTop: "8px", fontWeight: "600", color: "#ffffff" }}>Please note:</p>
                            <ul style={{ paddingLeft: "20px", marginTop: "4px", listStyleType: "disc" }}>
                                <li style={{ marginBottom: "4px" }}>Your account will become inactive.</li>
                                <li style={{ marginBottom: "4px" }}>Your transaction history will remain securely archived.</li>
                                <li style={{ marginBottom: "4px" }}>This action cannot be undone.</li>
                            </ul>
                        </div>
                        
                        <div className="form-field" style={{ textAlign: "left", marginBottom: "20px" }}>
                            <label style={{ color: "var(--gray-300)", fontSize: "12px" }}>Reason for closure</label>
                            <input 
                                type="text" 
                                placeholder="E.g., switching banks, no longer needed" 
                                value={closureReason}
                                onChange={e => setClosureReason(e.target.value)}
                                style={{ 
                                    background: "rgba(255,255,255,0.06)", 
                                    border: "1px solid rgba(255,255,255,0.15)", 
                                    color: "#ffffff", 
                                    borderRadius: "var(--border-radius-xs)", 
                                    padding: "12px", 
                                    width: "100%", 
                                    marginTop: "6px",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div style={{ display: "flex", gap: "12px" }}>
                            <button className="btn-secondary-outline" onClick={() => setShowConfirmModal(false)} disabled={isClosing}>
                                Cancel
                            </button>
                            <button 
                                className="btn-danger-solid" 
                                onClick={handleFinalClose}
                                disabled={isClosing || !closureReason.trim()}
                            >
                                {isClosing ? "Closing..." : "Close Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="onboarding-modal-overlay">
                    <div className="luxury-modal-card" style={{ maxWidth: "460px" }}>
                        <span className="onboarding-modal-icon" style={{ fontSize: "48px" }}>🎉</span>
                        <h2>Account Closed Successfully</h2>
                        <p className="modal-message-body" style={{ marginTop: "12px", lineHeight: "1.6" }}>
                            Your Savings Account has been successfully closed.<br />
                            Your account history has been securely archived.<br />
                            Thank you for banking with Underseas Bank.
                        </p>
                        <button className="onboarding-modal-button" style={{ marginTop: "24px" }} onClick={() => setShowSuccessModal(false)}>
                            Done
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    )
}