import { Link } from "react-router-dom"

const productSections = [
    {
        title: "Accounts built for calm oversight",
        copy: "See balances, recent movement, and account health in a focused workspace designed for everyday financial control.",
        metric: "99.98%",
        label: "platform uptime"
    },
    {
        title: "Transfers with clear confirmation",
        copy: "Move money between accounts with readable states, precise references, and a record that is easy to audit later.",
        metric: "24/7",
        label: "secure access"
    },
    {
        title: "Credit, deposits, and cards in one vault",
        copy: "Loans, fixed deposits, and premium card workflows share a single product language, so every decision feels consistent.",
        metric: "256-bit",
        label: "encrypted sessions"
    }
]

export default function Landing() {
    return (
        <main className="landing-page">
            <nav className="landing-nav">
                <Link to="/" className="landing-brand">
                    <span className="landing-brand-mark">U</span>
                    <span>Underseas Bank</span>
                </Link>
                <div className="landing-links">
                    <a href="#products">Products</a>
                    <a href="#security">Security</a>
                    <a href="#stats">Scale</a>
                </div>
                <div className="landing-actions">
                    <Link to="/login" className="btn btn-ghost">Sign In</Link>
                    <Link to="/login" className="btn btn-primary">Open Account</Link>
                </div>
            </nav>

            <section className="landing-hero">
                <div className="hero-depth-field" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="landing-hero-content">
                    <p className="eyebrow">Private digital banking at depth</p>
                    <h1>Secure banking, held with quiet precision.</h1>
                    <p>
                        Underseas Bank brings accounts, transfers, lending, deposits, and cards into a composed financial command center.
                    </p>
                    <div className="landing-hero-actions">
                        <Link to="/login" className="btn btn-primary">Enter the Vault</Link>
                        <a href="#products" className="btn btn-ghost">Explore Products</a>
                    </div>
                    <div className="trust-row">
                        <span>Encrypted sessions</span>
                        <span>Continuous monitoring</span>
                        <span>Designed for accessibility</span>
                    </div>
                </div>
                <div className="landing-vault-card">
                    <div>
                        <span className="card-caption">Available Balance</span>
                        <strong>₹84,250.00</strong>
                    </div>
                    <div className="vault-card-chip"></div>
                    <div className="vault-card-number">•••• •••• •••• 4821</div>
                </div>
            </section>

            <section className="landing-trustbar" id="stats">
                <span>Digital account opening</span>
                <span>Real-time activity alerts</span>
                <span>Tabular financial reporting</span>
                <span>Reduced-motion support</span>
            </section>

            <section className="landing-products" id="products">
                {productSections.map((section, index) => (
                    <article className="product-feature" key={section.title}>
                        <div className="product-copy">
                            <p className="eyebrow">0{index + 1}</p>
                            <h2>{section.title}</h2>
                            <p>{section.copy}</p>
                            <Link to="/login">Open workspace</Link>
                        </div>
                        <div className="product-screenshot" aria-label={`${section.title} preview`}>
                            <div className="screenshot-topbar">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="screenshot-balance">
                                <span>{section.label}</span>
                                <strong>{section.metric}</strong>
                            </div>
                            <div className="screenshot-lines">
                                <i></i>
                                <i></i>
                                <i></i>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            <section className="landing-security" id="security">
                <p className="eyebrow">Security is the product</p>
                <h2>Every surface is designed to make sensitive money movement readable, intentional, and recoverable.</h2>
                <div className="security-grid">
                    <div>
                        <strong>Focused access</strong>
                        <span>Authentication-first product flow with clear session handoff.</span>
                    </div>
                    <div>
                        <strong>Readable records</strong>
                        <span>Transactions, loans, cards, and deposits use stable numeric alignment.</span>
                    </div>
                    <div>
                        <strong>Motion restraint</strong>
                        <span>Interaction feedback is damped, calm, and reduced when requested.</span>
                    </div>
                </div>
            </section>

            <section className="landing-final">
                <h2>Ready to enter your financial vault?</h2>
                <Link to="/login" className="btn btn-primary">Sign In Securely</Link>
            </section>

            <footer className="landing-footer">
                <span>Underseas Bank</span>
                <span>Product</span>
                <span>Security</span>
                <span>Legal</span>
                <span>Contact</span>
            </footer>
        </main>
    )
}
