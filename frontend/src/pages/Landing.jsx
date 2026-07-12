import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"

const productSections = [
    {
        depth: "40m",
        title: "Accounts that live in the shallows",
        copy: "Shoal, Current, and Tide — everyday spending, day-to-day checking, and salary, each with its own view of your money.",
        cta: "Compare account tiers",
        to: "/login"
    },
    {
        depth: "800m",
        title: "Transfers, without the murk",
        copy: "Move money between accounts with readable states, precise references, and a record that stays legible months later.",
        cta: "Open workspace",
        to: "/login"
    },
    {
        depth: "2200m",
        title: "Abyss Signature credit",
        copy: "Apply straight from your dashboard, pick a limit that fits, and earn cashback on everything — no fine print buried in the trench.",
        cta: "Apply for Abyss Signature",
        to: "/login"
    }
]

function FishIcon({ color = "#DCEBF7", flip = false }) {
    return (
        <svg viewBox="0 0 60 34" width="100%" height="100%" style={{ transform: flip ? "scaleX(-1)" : "none" }}>
            <path
                d="M4 17 C 4 9, 16 4, 30 8 C 40 4, 52 6, 58 12 L 50 17 L 58 22 C 52 28, 40 30, 30 26 C 16 30, 4 25, 4 17 Z"
                fill={color}
                opacity="0.92"
            />
            <circle cx="16" cy="15" r="1.6" fill="#0A1220" opacity="0.6" />
        </svg>
    )
}

function Bubble({ style }) {
    return <span className="uw-bubble" style={style}></span>
}

export default function Landing() {
    const [activeDepth, setActiveDepth] = useState(0)
    const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

    const depthMarkers = ["0m", "40m", "800m", "4000m"]
    const depthLabels = ["Surface", "The Shallows", "The Twilight Zone", "The Abyss"]

    const bubbles = useMemo(() => {
        return Array.from({ length: 16 }).map((_, i) => ({
            left: `${Math.round(Math.random() * 96)}%`,
            size: 4 + Math.round(Math.random() * 10),
            duration: 9 + Math.round(Math.random() * 10),
            delay: -Math.round(Math.random() * 14)
        }))
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const idx = sectionRefs.findIndex((r) => r.current === entry.target)
                        if (idx !== -1) setActiveDepth(idx)
                    }
                })
            },
            { threshold: 0.4 }
        )
        sectionRefs.forEach((r) => r.current && observer.observe(r.current))
        return () => observer.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const showLegalNotice = (e) => {
        e.preventDefault()
        alert("Underseas Bank Legal Notice:\n\nThis application is a digital banking clone project. All transactions, balances, loans, cards, and portfolios are virtual and simulated for demonstration purposes. No real money or financial liabilities are involved.")
    }

    const scrollToTop = (e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <main className="landing-page uw-page">

            {/* ═══ DEPTH GAUGE (desktop only) ═══ */}
            <div className="uw-depth-gauge" aria-hidden="true">
                {depthMarkers.map((d, i) => (
                    <div key={d} className={`uw-depth-tick ${activeDepth === i ? "active" : ""}`}>
                        <span className="uw-depth-dot"></span>
                        <span className="uw-depth-label">{d}</span>
                    </div>
                ))}
            </div>

            {/* ═══ NAV ═══ */}
            <nav className="landing-nav">
                <Link to="/" className="landing-brand" onClick={scrollToTop}>
                    <div className="landing-brand-mark">
                        <img src="/underseas logo.jpeg" alt="Logo" />
                    </div>
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

            {/* ═══ 0m — SURFACE / HERO ═══ */}
            <section className="uw-hero" ref={sectionRefs[0]}>
                <div className="uw-rays" aria-hidden="true">
                    <span></span><span></span><span></span><span></span>
                </div>

                <div className="uw-bubbles" aria-hidden="true">
                    {bubbles.map((b, i) => (
                        <Bubble key={i} style={{
                            left: b.left,
                            width: b.size, height: b.size,
                            animationDuration: `${b.duration}s`,
                            animationDelay: `${b.delay}s`
                        }} />
                    ))}
                </div>

                <div className="uw-fish-school" aria-hidden="true">
                    <div className="uw-fish uw-fish-1"><FishIcon color="#DCEBF7" /></div>
                    <div className="uw-fish uw-fish-2"><FishIcon color="#8FE3D6" /></div>
                    <div className="uw-fish uw-fish-3"><FishIcon color="#FFB86B" flip /></div>
                    <div className="uw-fish uw-fish-4"><FishIcon color="#DCEBF7" /></div>
                    <div className="uw-fish uw-fish-5"><FishIcon color="#8FE3D6" flip /></div>
                </div>

                <div className="uw-hero-content">
                    <p className="eyebrow">0m · The Surface</p>
                    <h1>Banking that goes deeper than the surface.</h1>
                    <p className="uw-hero-sub">
                        Underseas Bank brings accounts, transfers, lending, deposits, and cards
                        into one current — clear at the surface, secure all the way down.
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

                <div className="uw-vault-card">
                    <div className="uw-vault-card-glow"></div>
                    <div>
                        <span className="card-caption">Available Balance</span>
                        <strong>₹84,250.00</strong>
                    </div>
                    <div className="vault-card-chip"></div>
                    <div className="vault-card-number">•••• •••• •••• 4821</div>
                </div>

                <svg className="uw-kelp-bed" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 160 L0 100 Q 60 40 100 100 T 200 100 T 300 100 T 400 100 T 500 100 T 600 100 T 700 100 T 800 100 T 900 100 T 1000 100 T 1100 100 T 1200 100 T 1300 100 T 1440 100 L1440 160 Z" fill="#0A2A33" />
                    <g className="uw-kelp-strand" style={{ transformOrigin: "120px 160px" }}>
                        <path d="M120 160 Q 108 120 122 90 Q 134 62 118 30" stroke="#12594F" strokeWidth="6" fill="none" strokeLinecap="round" />
                    </g>
                    <g className="uw-kelp-strand uw-kelp-2" style={{ transformOrigin: "260px 160px" }}>
                        <path d="M260 160 Q 274 118 258 86 Q 244 56 262 22" stroke="#0F4A42" strokeWidth="7" fill="none" strokeLinecap="round" />
                    </g>
                    <g className="uw-kelp-strand uw-kelp-3" style={{ transformOrigin: "1180px 160px" }}>
                        <path d="M1180 160 Q 1168 116 1184 84 Q 1198 54 1180 20" stroke="#12594F" strokeWidth="6" fill="none" strokeLinecap="round" />
                    </g>
                    <g className="uw-kelp-strand uw-kelp-2" style={{ transformOrigin: "1330px 160px" }}>
                        <path d="M1330 160 Q 1344 120 1328 88 Q 1314 58 1332 26" stroke="#0F4A42" strokeWidth="7" fill="none" strokeLinecap="round" />
                    </g>
                </svg>
            </section>

            <section className="uw-trustbar" id="stats">
                <span>Digital account opening</span>
                <span>Real-time activity alerts</span>
                <span>Tabular financial reporting</span>
                <span>Reduced-motion support</span>
            </section>

            {/* ═══ 40–2200m — SHALLOWS / PRODUCTS ═══ */}
            <section className="uw-products" id="products" ref={sectionRefs[1]}>
                <p className="eyebrow uw-section-eyebrow">40m · The Shallows</p>
                {productSections.map((section) => (
                    <article className="uw-product-feature" key={section.title}>
                        <div className="product-copy">
                            <p className="uw-depth-chip">{section.depth}</p>
                            <h2>{section.title}</h2>
                            <p>{section.copy}</p>
                            <Link to={section.to}>{section.cta} →</Link>
                        </div>
                        <div className="uw-tidepool" aria-hidden="true">
                            <div className="uw-tidepool-glow"></div>
                            <div className="uw-tidepool-fish"><FishIcon color="#FFB86B" /></div>
                        </div>
                    </article>
                ))}
            </section>

            {/* ═══ 800m — TWILIGHT ZONE / SECURITY ═══ */}
            <section className="uw-security" id="security" ref={sectionRefs[2]}>
                <p className="eyebrow">800m · The Twilight Zone</p>
                <h2>Every surface down here is built to protect what's above it.</h2>
                <div className="security-grid">
                    <div>
                        <span className="uw-pulse-dot"></span>
                        <strong>Focused access</strong>
                        <span>Authentication-first product flow with clear session handoff.</span>
                    </div>
                    <div>
                        <span className="uw-pulse-dot"></span>
                        <strong>Readable records</strong>
                        <span>Transactions, loans, cards, and deposits use stable numeric alignment.</span>
                    </div>
                    <div>
                        <span className="uw-pulse-dot"></span>
                        <strong>Motion restraint</strong>
                        <span>Interaction feedback is damped, calm, and reduced when requested.</span>
                    </div>
                </div>
            </section>

            {/* ═══ 4000m — THE ABYSS / FINAL CTA ═══ */}
            <section className="uw-final" ref={sectionRefs[3]}>
                <svg className="uw-anglerfish" viewBox="0 0 260 260" aria-hidden="true">
                    <g fill="#0B0906">
                        <path d="M110 130 Q80 100 50 114 Q80 126 80 146 Q80 166 50 178 Q80 192 110 162 Q132 174 124 146 Q132 118 110 130 Z" />
                    </g>
                    <path d="M110 126 Q80 70 68 50" stroke="#0B0906" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <circle cx="68" cy="48" r="7" fill="#2FE0C9" className="uw-lure-glow" />
                    <circle cx="68" cy="48" r="16" fill="#2FE0C9" opacity="0.2" className="uw-lure-glow" />
                </svg>
                <p className="eyebrow">4000m · The Abyss</p>
                <h2>Ready to enter your financial vault?</h2>
                <Link to="/login" className="btn btn-primary">Sign In Securely</Link>
            </section>

            <footer className="landing-footer uw-footer">
                <svg className="uw-seafloor" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 60 L0 30 Q 100 10 220 28 T 460 24 T 700 30 T 940 22 T 1180 30 T 1440 24 L1440 60 Z" fill="#020509" />
                </svg>
                <div className="landing-footer-links">
                    <Link to="/" onClick={scrollToTop}>Underseas Bank</Link>
                    <a href="#products">Product</a>
                    <a href="#security">Security</a>
                    <a href="#legal" onClick={showLegalNotice}>Legal</a>
                    <a href="mailto:support@underseas.com">Contact</a>
                </div>
                <p className="landing-footer-copyright">
                    &copy; {new Date().getFullYear()} Underseas Bank. All rights reserved to Meet Limbachiya.
                </p>
            </footer>

        </main>
    )
}
