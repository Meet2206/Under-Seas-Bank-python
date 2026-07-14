import { useEffect, useState } from "react"
import MainLayout from "../layout/MainLayout"
import { applyCreditCard, getCreditCards, getAccounts, getMe } from "../services/api"

const tiers = [
    {
        key: 'standard',
        name: 'Standard',
        limit: 1000,
        display: '₹1,000',
        gradient: 'linear-gradient(160deg, #8FD8C6 0%, #4FA9A0 100%)',
        moon: 'radial-gradient(circle, rgba(255,250,235,0.9), rgba(255,250,235,0))',
        accent: '#5FB8AC',
        bg: '#EAF7F4'
    },
    {
        key: 'silver',
        name: 'Silver',
        limit: 5000,
        display: '₹5,000',
        gradient: 'linear-gradient(160deg, #9FC4E8 0%, #6E93C9 100%)',
        moon: 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0))',
        accent: '#7DA3D6',
        bg: '#EAF1FB'
    },
    {
        key: 'gold',
        name: 'Gold',
        limit: 10000,
        display: '₹10,000',
        gradient: 'linear-gradient(160deg, #E8C589 0%, #C98F6E 100%)',
        moon: 'radial-gradient(circle, rgba(255,248,225,0.95), rgba(255,248,225,0))',
        accent: '#D9A96A',
        bg: '#FBF1E2'
    },
    {
        key: 'platinum',
        name: 'Platinum',
        limit: 25000,
        display: '₹25,000',
        gradient: 'linear-gradient(160deg, #2C4E6B 0%, #1B3350 100%)',
        moon: 'radial-gradient(circle, rgba(255,250,225,0.85), rgba(255,250,225,0))',
        accent: '#3B6E8C',
        bg: '#E9F0F4'
    }
]

export default function CreditCard() {
    const [accounts, setAccounts] = useState([])
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    const [accountId, setAccountId] = useState("")
    const [creditLimit, setCreditLimit] = useState("5000")
    const [selectedTier, setSelectedTier] = useState("silver")

    const loadData = async () => {
        try {
            const [accs, myCards, userData] = await Promise.all([
                getAccounts(),
                getCreditCards(),
                getMe().catch(() => null)
            ])
            setAccounts(accs)
            
            const cardsArray = Array.isArray(myCards) ? myCards : (myCards ? [myCards] : [])
            setCards(cardsArray)
            setUser(userData)
            
            if (accs.length > 0) {
                setAccountId(accs[0].id)
            }

            if (cardsArray.length > 0) {
                const activeCard = cardsArray[0]
                const matched = tiers.find(t => t.limit === Number(activeCard.credit_limit))
                if (matched) {
                    setSelectedTier(matched.key)
                    setCreditLimit(matched.limit.toString())
                }
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const apply = async () => {
        if (!accountId) {
            alert("Please select a linked bank account.")
            return
        }
        try {
            await applyCreditCard({
                account_id: Number(accountId),
                credit_limit: Number(creditLimit)
            })
            alert("Credit card application submitted!")
            loadData()
        } catch (err) {
            alert(err.message)
        }
    }

    const currentTier = tiers.find(t => t.key === selectedTier) || tiers[1]
    const hasCard = cards.length > 0

    return (
        <MainLayout title="Credit Cards" subtitle="Unlock premium perks and smart spending power">
            <style dangerouslySetInnerHTML={{__html: `
                @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Quicksand:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@1,500&display=swap');

                .pk-wrap {
                  font-family: 'Quicksand', sans-serif;
                  max-width: 420px;
                  margin: 0 auto;
                  padding: 28px 20px 36px;
                  background: #EEF6F4;
                  border-radius: 32px;
                  box-sizing: border-box;
                }

                .pk-card-stage {
                  position: relative;
                  height: 250px;
                  margin-bottom: 22px;
                }

                .pk-card {
                  position: absolute;
                  inset: 0;
                  border-radius: 26px;
                  padding: 26px 26px 0;
                  color: #fff;
                  overflow: hidden;
                  box-shadow: 0 12px 26px -12px rgba(20, 60, 70, 0.4);
                  transition: background 0.6s ease;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                }

                .pk-moon {
                  position: absolute;
                  top: -30px;
                  right: -20px;
                  width: 110px;
                  height: 110px;
                  border-radius: 50%;
                  filter: blur(1px);
                  opacity: 0.55;
                  transition: background 0.6s ease;
                }

                .pk-bubble {
                  position: absolute;
                  border-radius: 50%;
                  background: rgba(255,255,255,0.28);
                }

                .pk-waves {
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  height: 46px;
                  display: block;
                }

                .pk-top-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  position: relative;
                  z-index: 2;
                }

                .pk-brand {
                  font-family: 'Fredoka', sans-serif;
                  font-size: 25px;
                  font-weight: 600;
                  letter-spacing: 0.3px;
                }

                .pk-tier-tag {
                  font-size: 11px;
                  font-weight: 600;
                  letter-spacing: 1.5px;
                  text-transform: uppercase;
                  opacity: 0.8;
                  margin-top: 4px;
                }

                .pk-bank {
                  font-family: 'Cormorant Garamond', serif;
                  font-style: italic;
                  font-weight: 500;
                  font-size: 17px;
                  opacity: 0.95;
                  text-align: right;
                }

                .pk-mid {
                  position: relative;
                  z-index: 2;
                }

                .pk-balance-label {
                  font-size: 11px;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                  opacity: 0.85;
                  font-weight: 600;
                  margin-bottom: 4px;
                }

                .pk-balance {
                  font-family: 'Fredoka', sans-serif;
                  font-size: 33px;
                  font-weight: 600;
                  letter-spacing: 0.3px;
                }

                .pk-bottom-row {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                  position: relative;
                  z-index: 2;
                  padding-bottom: 16px;
                }

                .pk-holder {
                  font-size: 13px;
                  font-weight: 600;
                  opacity: 0.95;
                }

                .pk-number {
                  font-family: 'Quicksand', sans-serif;
                  font-weight: 600;
                  font-size: 15px;
                  letter-spacing: 2px;
                  margin-top: 4px;
                }

                .pk-chip {
                  width: 30px;
                  height: 30px;
                  border-radius: 50%;
                  background: rgba(255,255,255,0.55);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 13px;
                }

                .pk-select-label {
                  font-size: 13px;
                  font-weight: 700;
                  color: #3F8E86;
                  margin: 16px 2px 8px;
                  letter-spacing: 0.3px;
                }

                .pk-options {
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                  margin-bottom: 20px;
                }

                .pk-option {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 12px 16px;
                  border-radius: 16px;
                  background: #fff;
                  border: 1.5px solid #E2F0EC;
                  cursor: pointer;
                  transition: border-color 0.2s ease, background 0.2s ease;
                }

                .pk-option:hover {
                  border-color: #BFE3DA;
                }

                .pk-option.active {
                  border-color: var(--tier-accent, #5FB8AC);
                  background: var(--tier-bg, #EAF7F4);
                }

                .pk-option-left {
                  display: flex;
                  align-items: center;
                  gap: 10px;
                }

                .pk-swatch {
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  flex-shrink: 0;
                  box-shadow: 0 1px 2px rgba(0,0,0,0.15) inset;
                }

                .pk-option-name {
                  font-weight: 700;
                  font-size: 14px;
                  color: #2A5C58;
                }

                .pk-option-amt {
                  font-weight: 600;
                  font-size: 14px;
                  color: #3F8E86;
                }

                .pk-check {
                  color: #5FB8AC;
                  font-weight: 700;
                  font-size: 15px;
                  width: 18px;
                  text-align: center;
                }

                .pk-apply {
                  width: 100%;
                  border: none;
                  padding: 16px;
                  border-radius: 20px;
                  font-family: 'Fredoka', sans-serif;
                  font-size: 16px;
                  font-weight: 600;
                  color: #fff;
                  cursor: pointer;
                  background: linear-gradient(135deg, #6BC6B8, #4E9FC7);
                  box-shadow: 0 4px 12px -4px rgba(78, 159, 199, 0.55);
                  transition: transform 0.15s ease, box-shadow 0.15s ease;
                  letter-spacing: 0.3px;
                }

                .pk-apply:active {
                  transform: scale(0.97);
                  box-shadow: 0 4px 10px -4px rgba(78, 159, 199, 0.6);
                }
            `}} />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", paddingBottom: "40px" }}>
                <div className="pk-wrap" style={{ width: "100%" }}>
                    <div className="pk-card-stage">
                        <div className="pk-card" style={{ background: currentTier.gradient }}>
                            <div className="pk-moon" style={{ background: currentTier.moon }}></div>
                            <span className="pk-bubble" style={{ width: "8px", height: "8px", top: "64px", right: "38px" }}></span>
                            <span className="pk-bubble" style={{ width: "5px", height: "5px", top: "80px", right: "28px" }}></span>
                            
                            <div className="pk-top-row">
                                <div>
                                    <div className="pk-brand">Abyss</div>
                                    <div className="pk-tier-tag">{currentTier.name} credit</div>
                                </div>
                                <div className="pk-bank">Underseas Bank</div>
                            </div>
                            
                            <div className="pk-mid">
                                <div className="pk-balance-label">Available balance</div>
                                <div className="pk-balance">
                                    {hasCard 
                                        ? `₹${(cards[0].credit_limit - cards[0].used_credit).toLocaleString()}` 
                                        : currentTier.display
                                    }
                                </div>
                            </div>
                            
                            <div className="pk-bottom-row">
                                <div>
                                    <div className="pk-holder">{user?.name || "VALUED CUSTOMER"}</div>
                                    <div className="pk-number">
                                        {hasCard ? cards[0].card_number : "4053 5670 0360 8161"}
                                    </div>
                                </div>
                                <div className="pk-chip">🪸</div>
                            </div>
                            
                            <svg className="pk-waves" viewBox="0 0 400 46" preserveAspectRatio="none">
                                <path d="M0,20 C60,40 100,0 160,16 C220,32 260,4 320,18 C360,26 380,14 400,20 L400,46 L0,46 Z" fill="rgba(255,255,255,0.14)"/>
                                <path d="M0,30 C70,10 110,44 180,26 C240,10 280,36 340,24 C370,18 390,28 400,26 L400,46 L0,46 Z" fill="rgba(255,255,255,0.22)"/>
                            </svg>
                        </div>
                    </div>

                    {/* Linked Bank Account Selector (If applying) */}
                    {!hasCard && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px", padding: "0 2px" }}>
                            <label style={{ color: "#3F8E86", fontSize: "13px", fontWeight: "700", letterSpacing: "0.3px" }}>Linked Bank Account</label>
                            <select 
                                value={accountId} 
                                onChange={(e) => setAccountId(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: "16px",
                                    border: "1.5px solid #E2F0EC",
                                    background: "#fff",
                                    color: "#2a5c58",
                                    fontWeight: "600",
                                    fontFamily: "'Quicksand', sans-serif",
                                    fontSize: "14px",
                                    outline: "none"
                                }}
                            >
                                <option value="">Select Account</option>
                                {accounts.map((acc) => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.account_type} - {acc.account_number}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="pk-select-label">Choose your credit limit</div>
                    <div className="pk-options">
                        {tiers.map((t) => (
                            <div 
                                key={t.key}
                                className={`pk-option ${selectedTier === t.key ? 'active' : ''}`}
                                style={{
                                    '--tier-accent': t.accent,
                                    '--tier-bg': t.bg
                                }}
                                onClick={() => {
                                    if (!hasCard) {
                                        setSelectedTier(t.key)
                                        setCreditLimit(t.limit.toString())
                                    }
                                }}
                            >
                                <div className="pk-option-left">
                                    <span className="pk-check">{selectedTier === t.key ? '✓' : ''}</span>
                                    <span className="pk-swatch" style={{ background: t.gradient }}></span>
                                    <span className="pk-option-name">{t.name}</span>
                                </div>
                                <span className="pk-option-amt">{t.display}</span>
                            </div>
                        ))}
                    </div>

                    <button 
                        className="pk-apply" 
                        onClick={apply}
                        disabled={hasCard}
                        style={{
                            opacity: hasCard ? 0.75 : 1,
                            cursor: hasCard ? "default" : "pointer"
                        }}
                    >
                        {hasCard ? "Card Active" : "Apply now"}
                    </button>
                </div>

                {/* Existing Cards Section */}
                <div className="data-table-wrapper" style={{ width: "100%", maxWidth: "800px" }}>
                    <div className="panel-header" style={{ marginBottom: "20px" }}>
                        <h3>Existing Credit Cards</h3>
                        <span className="badge badge-info">{cards.length} Total</span>
                    </div>
                    
                    {loading ? (
                        <p className="loading-text">Loading...</p>
                    ) : cards.length === 0 ? (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                            <p>No credit cards issued yet.</p>
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Card Number</th>
                                    <th>Total Limit</th>
                                    <th>Utilized</th>
                                    <th>Available Credit</th>
                                    <th style={{ textAlign: "right" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cards.map((card) => (
                                    <tr key={card.id}>
                                        <td style={{ fontFamily: "monospace" }}>{card.card_number}</td>
                                        <td><strong>₹{card.credit_limit.toLocaleString()}</strong></td>
                                        <td style={{ color: "var(--danger)" }}>₹{card.used_credit.toLocaleString()}</td>
                                        <td><span style={{ color: "var(--success)", fontWeight: "700" }}>₹{(card.credit_limit - card.used_credit).toLocaleString()}</span></td>
                                        <td style={{ textAlign: "right" }}>
                                            <span className={`badge ${card.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                                                {card.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
