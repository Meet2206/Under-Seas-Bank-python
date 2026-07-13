import { useState, useEffect } from "react"
import MainLayout from "../layout/MainLayout"
import { transferMoney, deposit, withdraw, getAccounts, getBeneficiaries, lookupAccountByNumber } from "../services/api"

export default function Transfer() {
    const [accounts, setAccounts] = useState([])
    const [beneficiaries, setBeneficiaries] = useState([])
    const [mode, setMode] = useState("transfer") // transfer, deposit, withdraw
    const [loading, setLoading] = useState(false)

    // Transfer fields
    const [fromAccount, setFromAccount] = useState("")
    const [toSelectionValue, setToSelectionValue] = useState("") // "own-<id>", "beneficiary-<accNum>", "manual"
    const [toAccount, setToAccount] = useState("") // resolved ID
    const [manualAccountNumber, setManualAccountNumber] = useState("")
    const [amount, setAmount] = useState("")

    // Deposit / Withdraw fields
    const [selectedAccount, setSelectedAccount] = useState("")
    const [dwAmount, setDwAmount] = useState("")

    const loadData = async () => {
        try {
            const [accs, bens] = await Promise.all([
                getAccounts(),
                getBeneficiaries().catch(() => [])
            ])
            setAccounts(accs)
            setBeneficiaries(bens)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleToAccountSelection = async (val) => {
        setToSelectionValue(val)
        if (!val) {
            setToAccount("")
            return
        }
        if (val.startsWith("own-")) {
            const accId = val.replace("own-", "")
            setToAccount(accId)
        } else if (val.startsWith("beneficiary-")) {
            const accNum = val.replace("beneficiary-", "")
            setLoading(true)
            try {
                const resolved = await lookupAccountByNumber(accNum)
                setToAccount(resolved.id)
            } catch (err) {
                alert("Could not resolve beneficiary account ID: " + err.message)
                setToAccount("")
            } finally {
                setLoading(false)
            }
        } else if (val === "manual") {
            setToAccount("")
        }
    }

    const handleTransferSubmit = async () => {
        let finalToAccountId = toAccount

        if (toSelectionValue === "manual") {
            if (!manualAccountNumber) {
                alert("Please enter a destination account number")
                return
            }
            setLoading(true)
            try {
                const resolved = await lookupAccountByNumber(manualAccountNumber)
                finalToAccountId = resolved.id
            } catch (err) {
                alert("Recipient account number not found: " + err.message)
                setLoading(false)
                return
            }
        }

        if (!fromAccount) {
            alert("Please select a source account")
            setLoading(false)
            return
        }
        if (!finalToAccountId) {
            alert("Please select a destination account")
            setLoading(false)
            return
        }
        if (Number(fromAccount) === Number(finalToAccountId)) {
            alert("Cannot transfer to the same account")
            setLoading(false)
            return
        }
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid transfer amount")
            setLoading(false)
            return
        }

        setLoading(true)
        try {
            const result = await transferMoney({
                from_account_id: Number(fromAccount),
                to_account_id: Number(finalToAccountId),
                amount: Number(amount)
            })

            let recipientName = "Beneficiary";
            if (toSelectionValue.startsWith("own-")) {
                const accId = toSelectionValue.replace("own-", "");
                const ownAcc = accounts.find(a => a.id === Number(accId));
                if (ownAcc) recipientName = `${ownAcc.account_type} Account`;
            } else if (toSelectionValue.startsWith("beneficiary-")) {
                const accNum = toSelectionValue.replace("beneficiary-", "");
                const ben = beneficiaries.find(b => b.account_number === accNum);
                if (ben) recipientName = ben.name;
            } else if (toSelectionValue === "manual") {
                recipientName = `Account #${manualAccountNumber}`;
            }

            const fromAccObj = accounts.find(a => a.id === Number(fromAccount));
            const newBal = fromAccObj ? (fromAccObj.balance - Number(amount)) : 0;

            if (window.showRichAlert) {
                window.showRichAlert({
                    title: "Transfer Successful",
                    message: `₹${Number(amount).toLocaleString()} has been transferred to ${recipientName}.`,
                    type: "success",
                    details: {
                        amount: Number(amount),
                        recipient: recipientName,
                        reference: `TXN${result?.id || Math.floor(10000000 + Math.random() * 90000000)}`,
                        balance: newBal
                    }
                });
            } else {
                alert("Transfer Successful!");
            }

            setAmount("")
            setManualAccountNumber("")
            setToSelectionValue("")
            setToAccount("")
            await loadData()
        } catch (err) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (actionFn, fields) => {
        setLoading(true)
        try {
            await actionFn(fields)
            alert("Success!")
            // Reset fields
            setAmount("")
            setDwAmount("")
            // Refresh accounts
            await loadData()
        } catch (err) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout title="Money Operations" subtitle="Transfer, deposit, or withdraw funds securely">
            <div className="btn-group">
                <button
                    className={`btn-tab ${mode === "transfer" ? "active" : ""}`}
                    onClick={() => setMode("transfer")}
                >
                    Transfer
                </button>
                <button
                    className={`btn-tab ${mode === "deposit" ? "active" : ""}`}
                    onClick={() => setMode("deposit")}
                >
                    Deposit
                </button>
                <button
                    className={`btn-tab ${mode === "withdraw" ? "active" : ""}`}
                    onClick={() => setMode("withdraw")}
                >
                    Withdraw
                </button>
            </div>

            <div className="grid-2-1">
                <div className="form-section">
                    <h3>{mode.charAt(0).toUpperCase() + mode.slice(1)} Funds</h3>

                    {mode === "transfer" ? (
                        <>
                            <div className="form-field">
                                <label>From Account</label>
                                <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
                                    <option value="">Select Account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.id} value={acc.id}>{acc.account_type} - {acc.account_number} (₹{acc.balance})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label>To Account</label>
                                <select value={toSelectionValue} onChange={(e) => handleToAccountSelection(e.target.value)}>
                                    <option value="">Select Destination Account</option>
                                    {accounts.filter(acc => acc.id !== Number(fromAccount)).length > 0 && (
                                        <optgroup label="My Other Accounts">
                                            {accounts
                                                .filter(acc => acc.id !== Number(fromAccount))
                                                .map(acc => (
                                                    <option key={acc.id} value={`own-${acc.id}`}>{acc.account_type} - {acc.account_number} (₹{acc.balance})</option>
                                                ))
                                            }
                                        </optgroup>
                                    )}
                                    {beneficiaries.length > 0 && (
                                        <optgroup label="My Beneficiaries">
                                            {beneficiaries.map(b => (
                                                <option key={b.id} value={`beneficiary-${b.account_number}`}>{b.name} ({b.bank_name})</option>
                                            ))}
                                        </optgroup>
                                    )}
                                    <option value="manual">Enter Account Number Manually...</option>
                                </select>
                            </div>

                            {toSelectionValue === "manual" && (
                                <div className="form-field">
                                    <label>Recipient Account Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter recipient account number"
                                        value={manualAccountNumber}
                                        onChange={(e) => setManualAccountNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-field">
                                <label>Amount (INR)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleTransferSubmit}
                                style={{ width: "100%", justifyContent: "center" }}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Transfer Now"}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="form-field">
                                <label>Select Account</label>
                                <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                                    <option value="">Select Account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.id} value={acc.id}>{acc.account_type} - {acc.account_number} (₹{acc.balance})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Amount (INR)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={dwAmount}
                                    onChange={(e) => setDwAmount(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => mode === "deposit"
                                    ? handleAction(deposit, { account_id: Number(selectedAccount), amount: Number(dwAmount) })
                                    : handleAction(withdraw, { account_id: Number(selectedAccount), amount: Number(dwAmount) })
                                }
                                style={{ width: "100%", justifyContent: "center" }}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        </>
                    )}
                </div>


                <div className="panel">
                    <h3>Quick Tips</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <div className="stat-card-icon teal" style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <p style={{ fontSize: "12px", color: "var(--gray-600)", lineHeight: "1.5" }}>
                                <strong>Secure Transfers:</strong> Always double-check the recipient's account ID before confirming.
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <div className="stat-card-icon teal" style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <p style={{ fontSize: "12px", color: "var(--gray-600)", lineHeight: "1.5" }}>
                                <strong>Instant Settlement:</strong> Transfers within Underseas Bank are instant and free of charge.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}