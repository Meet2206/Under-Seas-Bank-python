import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import "./Landing.css"

const reefAssets = {
    heroVideo: "https://videos.pexels.com/video-files/3326928/3326928-uhd_2560_1440_24fps.mp4",
    coralGarden: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=85",
    turtle: "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1100&q=85",
    reefFish: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1100&q=85",
    blueDepth: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1300&q=85",
    coralMacro: "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1100&q=85"
}

const reefCards = [
    {
        image: reefAssets.turtle,
        label: "Turtle-grade patience",
        title: "Savings that cruise calmly",
        copy: "Set aside money in current, shoal, and tide accounts with a clear view of every rupee moving through the reef."
    },
    {
        image: reefAssets.reefFish,
        label: "Fish-school transfers",
        title: "Money moves in formation",
        copy: "Send funds between accounts with tidy references, readable confirmations, and activity alerts that do not hide in the dark."
    },
    {
        image: reefAssets.coralGarden,
        label: "Coral vault security",
        title: "Layered protection",
        copy: "Encrypted sessions, authentication-first flows, and stable records give every balance a well-lit place to live."
    }
]

const products = [
    {
        depth: "40m",
        name: "Reef Current Account",
        copy: "For everyday spending, salary flow, and quick balance checks. Bright, practical, and always close to the surface.",
        stat: "24/7",
        statLabel: "activity visibility"
    },
    {
        depth: "800m",
        name: "Pearl Fixed Deposits",
        copy: "Lock funds into calm growth pools and track maturity, principal, and returns without spreadsheet fog.",
        stat: "6.8%",
        statLabel: "sample annual glow"
    },
    {
        depth: "2200m",
        name: "Abyss Signature Card",
        copy: "A premium credit card concept with cashback, limits, repayments, and clean statements built into the dashboard.",
        stat: "5%",
        statLabel: "cashback reef rewards"
    }
]

const mediaLinks = [
    { text: "Hero reef video", href: reefAssets.heroVideo },
    { text: "Coral garden image", href: reefAssets.coralGarden },
    { text: "Sea turtle image", href: reefAssets.turtle },
    { text: "Reef fish image", href: reefAssets.reefFish }
]

function Bubble({ style }) {
    return <span className="ocean-bubble" style={style} />
}

function Fish({ className = "", color = "#9ff7ef", flip = false }) {
    return (
        <svg className={`ocean-fish ${className}`} viewBox="0 0 90 48" aria-hidden="true" style={{ scale: flip ? "-1 1" : "1 1" }}>
            <path d="M82 24C73 8 47 5 29 17L10 6l7 18-7 18 19-11c18 12 44 9 53-7Z" fill={color} />
            <path d="M43 16c-7 7-7 18 0 25" fill="none" stroke="rgba(1, 20, 31, .28)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="65" cy="20" r="3" fill="#05233a" />
        </svg>
    )
}

function Turtle() {
    return (
        <svg className="ocean-turtle" viewBox="0 0 210 130" aria-hidden="true">
            <path d="M77 34C100 10 145 19 159 50c11 24-3 53-32 61-32 9-70-5-82-31C37 62 55 43 77 34Z" fill="#63d7b6" />
            <path d="M82 41c17-13 48-9 63 11-9 7-16 20-16 39-22 3-47-4-62-20 7-11 11-21 15-30Z" fill="#216c64" opacity=".62" />
            <path d="M158 53c17-7 33-2 40 9-8 11-24 15-40 7Z" fill="#8df0cf" />
            <circle cx="187" cy="60" r="2.8" fill="#05233a" />
            <path d="M68 36C47 19 23 18 10 32c15 18 37 20 58 11Z" fill="#54c8a6" />
            <path d="M65 92c-24 5-41 20-43 39 24 0 43-11 55-31Z" fill="#54c8a6" />
            <path d="M134 27c15-17 36-23 52-15-4 22-19 34-42 35Z" fill="#54c8a6" />
            <path d="M132 101c17 10 38 11 52 0-9-18-25-25-48-20Z" fill="#54c8a6" />
        </svg>
    )
}

function Jellyfish({ className = "" }) {
    return (
        <svg className={`ocean-jelly ${className}`} viewBox="0 0 120 180" aria-hidden="true">
            <path d="M20 73C21 35 38 14 62 14c27 0 42 25 40 59-9 7-22 11-41 11-18 0-31-4-41-11Z" fill="rgba(255, 137, 194, .78)" />
            <path d="M23 72c13 12 61 13 77 0v16c-15 12-61 12-77 0Z" fill="rgba(255, 244, 190, .7)" />
            <path d="M42 86c-9 25 17 39 3 74M61 86c-12 34 15 43 0 82M80 86c-8 23 14 38 1 70" fill="none" stroke="rgba(255, 169, 210, .82)" strokeWidth="5" strokeLinecap="round" />
        </svg>
    )
}

export default function Landing() {
    const [activeDepth, setActiveDepth] = useState(0)
    const sectionRefs = useRef([null, null, null, null])
    const depthMarkers = ["0m", "40m", "800m", "4000m"]

    const bubbles = useMemo(() => {
        return Array.from({ length: 34 }).map((_, i) => ({
            left: `${(i * 13 + 7) % 100}%`,
            size: 5 + ((i * 5) % 18),
            duration: 9 + ((i * 3) % 12),
            delay: -((i * 2) % 16)
        }))
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = sectionRefs.current.findIndex((section) => section === entry.target)
                        if (index !== -1) setActiveDepth(index)
                    }
                })
            },
            { threshold: 0.38 }
        )

        sectionRefs.current.forEach((section) => {
            if (section) observer.observe(section)
        })

        return () => observer.disconnect()
    }, [])

    const showLegalNotice = (event) => {
        event.preventDefault()
        alert("Underseas Bank Legal Notice:\n\nThis application is a digital banking clone project. All transactions, balances, loans, cards, and portfolios are virtual and simulated for demonstration purposes. No real money or financial liabilities are involved.")
    }

    const scrollToTop = (event) => {
        event.preventDefault()
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <main className="ocean-page">
            <div className="ocean-depth-gauge" aria-hidden="true">
                {depthMarkers.map((depth, index) => (
                    <span key={depth} className={activeDepth === index ? "is-active" : ""}>
                        <i />
                        {depth}
                    </span>
                ))}
            </div>

            <nav className="ocean-nav">
                <Link to="/" className="ocean-brand" onClick={scrollToTop}>
                    <span className="ocean-brand-mark">
                        <img src="/underseas logo.jpeg" alt="Underseas Bank logo" />
                    </span>
                    <span>Underseas Bank</span>
                </Link>
                <div className="ocean-nav-links">
                    <a href="#reef">Reef</a>
                    <a href="#products">Products</a>
                    <a href="#security">Security</a>
                    <a href="#media">Media</a>
                </div>
                <div className="ocean-nav-actions">
                    <Link to="/login" className="ocean-button ocean-button-soft">Sign In</Link>
                    <Link to="/login" className="ocean-button ocean-button-bright">Open Account</Link>
                </div>
            </nav>

            <section className="ocean-hero" ref={(node) => { sectionRefs.current[0] = node }}>
                <video className="ocean-hero-video" src={reefAssets.heroVideo} autoPlay loop muted playsInline />
                <div className="ocean-current" aria-hidden="true" />
                <div className="ocean-rays" aria-hidden="true"><i /><i /><i /><i /></div>
                <div className="ocean-bubbles" aria-hidden="true">
                    {bubbles.map((bubble, index) => (
                        <Bubble
                            key={index}
                            style={{
                                left: bubble.left,
                                width: bubble.size,
                                height: bubble.size,
                                animationDuration: `${bubble.duration}s`,
                                animationDelay: `${bubble.delay}s`
                            }}
                        />
                    ))}
                </div>
                <Fish className="fish-one" color="#ffcf6f" />
                <Fish className="fish-two" color="#6ff5df" flip />
                <Fish className="fish-three" color="#ff7ca8" />
                <Turtle />
                <Jellyfish />

                <div className="ocean-hero-content">
                    <p className="ocean-eyebrow">0m · Welcome to the living vault</p>
                    <h1>Underseas Bank</h1>
                    <p className="ocean-hero-copy">
                        A banking experience imagined as a glowing ocean world: accounts in the reef,
                        transfers in formation, savings like pearls, and security layered like coral.
                    </p>
                    <div className="ocean-hero-actions">
                        <Link to="/login" className="ocean-button ocean-button-bright">Dive Into Your Vault</Link>
                        <a href="#reef" className="ocean-button ocean-button-glass">Explore the Reef</a>
                    </div>
                    <div className="ocean-trust-row">
                        <span>Encrypted sessions</span>
                        <span>Real-time alerts</span>
                        <span>Virtual demo bank</span>
                    </div>
                </div>

                <aside className="ocean-vault-card" aria-label="Decorative account card">
                    <div>
                        <span>Coral Vault Balance</span>
                        <strong>₹84,250.00</strong>
                    </div>
                    <div className="ocean-card-chip" />
                    <p>•••• •••• •••• 4821</p>
                    <small>Cashback current · Pearl deposits · Abyss credit</small>
                </aside>

                <div className="ocean-seafloor" aria-hidden="true">
                    <span /><span /><span /><span /><span /><span /><span /><span />
                </div>
            </section>

            <section className="ocean-reef" id="reef" ref={(node) => { sectionRefs.current[1] = node }}>
                <div className="ocean-section-heading">
                    <p className="ocean-eyebrow">40m · The reef lobby</p>
                    <h2>Every banking feature gets a creature, a color, and a reason to exist.</h2>
                </div>
                <div className="ocean-reef-grid">
                    {reefCards.map((card) => (
                        <article className="ocean-reef-card" key={card.title}>
                            <img src={card.image} alt="" />
                            <div>
                                <span>{card.label}</span>
                                <h3>{card.title}</h3>
                                <p>{card.copy}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="ocean-products" id="products">
                <div className="ocean-section-heading">
                    <p className="ocean-eyebrow">800m · Product trench</p>
                    <h2>Banking products shaped like an expedition.</h2>
                </div>
                <div className="ocean-product-shells">
                    {products.map((product) => (
                        <article className="ocean-product-shell" key={product.name}>
                            <span className="ocean-depth-chip">{product.depth}</span>
                            <h3>{product.name}</h3>
                            <p>{product.copy}</p>
                            <div>
                                <strong>{product.stat}</strong>
                                <span>{product.statLabel}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="ocean-security" id="security" ref={(node) => { sectionRefs.current[2] = node }}>
                <div className="ocean-security-media">
                    <img src={reefAssets.coralMacro} alt="" />
                    <Jellyfish className="security-jelly" />
                </div>
                <div className="ocean-security-copy">
                    <p className="ocean-eyebrow">2200m · Coral firewall</p>
                    <h2>Beautiful, but still built like a vault.</h2>
                    <p>
                        The page can be playful because the app underneath stays practical: authentication-first entry,
                        readable financial records, dashboard reporting, account management, transfers, loans, cards,
                        deposits, and statement flows.
                    </p>
                    <div className="ocean-security-list">
                        <span>Biometric-inspired sign-in gateway</span>
                        <span>Clear tabular history for every transaction</span>
                        <span>Accessible contrast with reduced-motion support</span>
                    </div>
                </div>
            </section>

            <section className="ocean-media" id="media">
                <div className="ocean-section-heading">
                    <p className="ocean-eyebrow">Asset tidepool</p>
                    <h2>Real underwater media links are baked into the design.</h2>
                </div>
                <div className="ocean-media-board">
                    <img src={reefAssets.blueDepth} alt="" />
                    <div>
                        {mediaLinks.map((link) => (
                            <a key={link.text} href={link.href} target="_blank" rel="noreferrer">
                                {link.text}
                                <span>Open source asset</span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ocean-final" ref={(node) => { sectionRefs.current[3] = node }}>
                <Fish className="final-fish-left" color="#ffd166" />
                <Fish className="final-fish-right" color="#9ff7ef" flip />
                <p className="ocean-eyebrow">4000m · The glowing abyss</p>
                <h2>Your money deserves a vault with a view.</h2>
                <Link to="/login" className="ocean-button ocean-button-bright">Sign In Securely</Link>
            </section>

            <footer className="ocean-footer">
                <div className="ocean-footer-links">
                    <Link to="/" onClick={scrollToTop}>Underseas Bank</Link>
                    <a href="#products">Products</a>
                    <a href="#security">Security</a>
                    <a href="#legal" onClick={showLegalNotice}>Legal</a>
                    <a href="mailto:support@underseas.com">Contact</a>
                </div>
                <p>&copy; {new Date().getFullYear()} Underseas Bank. All rights reserved to Meet Limbachiya.</p>
            </footer>
        </main>
    )
}
