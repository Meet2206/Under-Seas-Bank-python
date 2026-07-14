import { useId } from "react"

export default function BankCard({ type, accountType, balance, cardNumber, holderName, onClick }) {
    const t = type?.toLowerCase();
    const isThalassa = t === "thalassa" || t === "abyss";
    const isSwell = t === "swell" || t === "current";
    const isTide = t === "tide";
    const isCove = t === "cove" || t === "shoal" || !t;
    const uid = useId().replace(/:/g, "");
    const cardClass = isSwell ? "current" : isTide ? "tide" : isThalassa ? "abyss" : "shoal";

    let tierName = "Cove";
    let defaultSub = "Savings Account";
    let textColor = "#F4FBFA";
    let subColor = "#EAFBF7";

    if (isSwell) {
        tierName = "Swell";
        defaultSub = "Current Account";
        textColor = "#F4FBFA";
        subColor = "#E3D8F5";
    } else if (isTide) {
        tierName = "Tide";
        defaultSub = "Salary Account";
        textColor = "#F4FBFA";
        subColor = "#CFE3F5";
    } else if (isThalassa) {
        tierName = "Thalassa";
        defaultSub = "Signature Credit";
        textColor = "#F3D89A";
        subColor = "#C7AD79";
    }

    // Show the real account type from your data if it's passed in,
    // otherwise fall back to the tier's default label.
    const tierSub = accountType || defaultSub;

    return (
        <div className={`new-bank-card ${cardClass}`} onClick={onClick}>
            {isCove && (
                <svg viewBox="0 0 360 227" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id={`skyShoal-${uid}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#CDEFE6"/>
                      <stop offset="45%" stopColor="#5FC2C9"/>
                      <stop offset="100%" stopColor="#12707F"/>
                    </linearGradient>
                    <radialGradient id={`sunShoal-${uid}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFE1B8"/>
                      <stop offset="60%" stopColor="#FF9B5C"/>
                      <stop offset="100%" stopColor="#FF9B5C" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="360" height="227" fill={`url(#skyShoal-${uid})`}/>
                  <circle cx="270" cy="58" r="46" fill={`url(#sunShoal-${uid})`}/>
                  <circle cx="270" cy="58" r="20" fill="#FFDFA0"/>
                  <g fill="#0E4F5C" opacity="0.85">
                    <path d="M60 50 l10 -5 l0 10 z"/>
                    <path d="M78 60 l10 -5 l0 10 z"/>
                    <path d="M50 68 l10 -5 l0 10 z"/>
                  </g>
                  <path d="M0 150 Q 60 110 120 140 T 240 130 T 360 145 V227 H0 Z" fill="#0E5866"/>
                  <path d="M0 175 Q 80 140 170 168 T 360 165 V227 H0 Z" fill="#0A3E48"/>
                  <path d="M0 200 Q 90 178 190 198 T 360 195 V227 H0 Z" fill="#062C33"/>
                  <g fill="#FF8F6B" opacity="0.9">
                    <circle cx="40" cy="190" r="9"/>
                    <circle cx="58" cy="182" r="6"/>
                  </g>
                  <g fill="#FFC15C" opacity="0.9">
                    <circle cx="315" cy="195" r="7"/>
                    <circle cx="330" cy="205" r="5"/>
                  </g>
                  <g fill="#EAFBF7" opacity="0.55">
                    <circle cx="150" cy="40" r="3"/>
                    <circle cx="165" cy="55" r="2"/>
                    <circle cx="200" cy="30" r="2.5"/>
                  </g>
                </svg>
            )}

            {isSwell && (
                <svg viewBox="0 0 360 227" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id={`skyCurrent-${uid}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6A5AA8"/>
                      <stop offset="50%" stopColor="#3B2E72"/>
                      <stop offset="100%" stopColor="#170F3A"/>
                    </linearGradient>
                    <radialGradient id={`glowCurrent-${uid}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FBD9A8"/>
                      <stop offset="55%" stopColor="#E888B0"/>
                      <stop offset="100%" stopColor="#E888B0" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="360" height="227" fill={`url(#skyCurrent-${uid})`}/>
                  <circle cx="270" cy="55" r="48" fill={`url(#glowCurrent-${uid})`}/>
                  <circle cx="270" cy="55" r="18" fill="#FCE3C2"/>
                  <g opacity="0.9">
                    <ellipse cx="70" cy="55" rx="16" ry="11" fill="#F3B4D6"/>
                    <path d="M58 60 Q60 78 56 92 M66 63 Q66 80 64 95 M74 63 Q76 80 78 95 M82 60 Q84 78 88 92" stroke="#F3B4D6" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8"/>
                  </g>
                  <path d="M0 150 Q 70 115 150 145 T 360 140 V227 H0 Z" fill="#241B4E"/>
                  <path d="M0 175 Q 90 148 190 172 T 360 168 V227 H0 Z" fill="#180F38"/>
                  <path d="M0 200 Q 100 182 200 200 T 360 197 V227 H0 Z" fill="#0D0824"/>
                  <g fill="#EDE6FA" opacity="0.5">
                    <circle cx="140" cy="35" r="2.5"/>
                    <circle cx="160" cy="50" r="2"/>
                    <circle cx="120" cy="60" r="3"/>
                  </g>
                </svg>
            )}

            {isTide && (
                <svg viewBox="0 0 360 227" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id={`skyTide-${uid}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1C3552"/>
                      <stop offset="50%" stopColor="#122943"/>
                      <stop offset="100%" stopColor="#081524"/>
                    </linearGradient>
                    <radialGradient id={`moonTide-${uid}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#F4FBFF"/>
                      <stop offset="55%" stopColor="#BFDCF2"/>
                      <stop offset="100%" stopColor="#BFDCF2" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="360" height="227" fill={`url(#skyTide-${uid})`}/>
                  <g fill="#EAF4FF" opacity="0.7">
                    <circle cx="60" cy="24" r="1.4"/>
                    <circle cx="110" cy="18" r="1"/>
                    <circle cx="150" cy="34" r="1.4"/>
                    <circle cx="190" cy="16" r="1"/>
                    <circle cx="40" cy="42" r="1"/>
                  </g>
                  <circle cx="270" cy="55" r="50" fill={`url(#moonTide-${uid})`}/>
                  <circle cx="270" cy="55" r="19" fill="#F4FBFF"/>
                  <circle cx="278" cy="48" r="3.2" fill="#CFE3F5" opacity="0.6"/>
                  <circle cx="264" cy="62" r="2.2" fill="#CFE3F5" opacity="0.5"/>
                  <g fill="#DCEBF7" opacity="0.9">
                    <path d="M50 70 l9 -4.5 l0 9 z"/>
                    <path d="M64 66 l9 -4.5 l0 9 z"/>
                    <path d="M78 70 l9 -4.5 l0 9 z"/>
                    <path d="M58 80 l9 -4.5 l0 9 z"/>
                    <path d="M72 84 l9 -4.5 l0 9 z"/>
                  </g>
                  <path d="M0 150 Q 65 118 140 144 T 360 138 V227 H0 Z" fill="#16283F"/>
                  <path d="M0 176 Q 85 150 180 172 T 360 166 V227 H0 Z" fill="#0F1C2E"/>
                  <path d="M0 200 Q 95 184 195 200 T 360 197 V227 H0 Z" fill="#0A121F"/>
                  <g fill="#EAF4FF" opacity="0.35">
                    <rect x="255" y="150" width="6" height="4" rx="1"/>
                    <rect x="266" y="160" width="9" height="4" rx="1"/>
                    <rect x="248" y="170" width="7" height="4" rx="1"/>
                  </g>
                </svg>
            )}

            {isThalassa && (
                <svg viewBox="0 0 360 227" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id={`skyAbyss-${uid}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#171208"/>
                      <stop offset="100%" stopColor="#050402"/>
                    </linearGradient>
                    <radialGradient id={`glowAbyss-${uid}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FBE7B4"/>
                      <stop offset="55%" stopColor="#D9B36C"/>
                      <stop offset="100%" stopColor="#D9B36C" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="360" height="227" fill={`url(#skyAbyss-${uid})`}/>
                  <circle cx="270" cy="55" r="50" fill={`url(#glowAbyss-${uid})`}/>
                  <circle cx="270" cy="55" r="16" fill="#FCEFC9"/>
                  <g fill="#0B0906">
                    <path d="M55 70 Q40 55 25 62 Q40 68 40 78 Q40 88 25 94 Q40 101 55 86 Q66 92 62 78 Q66 64 55 70 Z"/>
                    <circle cx="46" cy="74" r="2" fill="#2FE6C4"/>
                  </g>
                  <path d="M55 68 Q40 40 34 30" stroke="#0B0906" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <circle cx="34" cy="29" r="4" fill="#2FE6C4"/>
                  <circle cx="34" cy="29" r="8" fill="#2FE6C4" opacity="0.25"/>
                  <path d="M0 150 Q 70 122 150 148 T 360 143 V227 H0 Z" fill="#151007"/>
                  <path d="M0 178 Q 90 155 190 176 T 360 172 V227 H0 Z" fill="#0C0904"/>
                  <path d="M0 202 Q 100 188 200 203 T 360 200 V227 H0 Z" fill="#050302"/>
                </svg>
            )}

            <div className="new-bank-card-info" style={{ color: textColor }}>
                <div className="new-bank-card-top-row">
                    <div>
                        <div className="new-bank-card-tier-name">{tierName}</div>
                        <div className="new-bank-card-tier-sub" style={{ color: subColor }}>{tierSub}</div>
                    </div>
                    <div className="new-bank-card-brand">Underseas Bank</div>
                </div>

                <div className="new-bank-card-middle-row">
                    <div className="new-bank-card-balance">
                        <span>Available Balance</span>
                        <h2>{balance}</h2>
                    </div>
                </div>

                <div className="new-bank-card-meta">
                    <div className="new-bank-card-holder-info">
                        <span className="new-bank-card-holder-name">{holderName}</span>
                        <span className="new-bank-card-num">{cardNumber}</span>
                    </div>
                    <svg className="new-bank-card-chip-mini" viewBox="0 0 26 19">
                        <rect x="0.5" y="0.5" width="25" height="18" rx="3.5" fill="#F3D89A" stroke="#8a6a34" strokeWidth="0.5"/>
                        <line x1="9" y1="0.5" x2="9" y2="18.5" stroke="#8a6a34" stroke-width="0.5"/>
                        <line x1="17" y1="0.5" x2="17" y2="18.5" stroke="#8a6a34" stroke-width="0.5"/>
                        <line x1="0.5" y1="7" x2="25.5" y2="7" stroke="#8a6a34" stroke-width="0.5"/>
                        <line x1="0.5" y1="12.5" x2="25.5" y2="12.5" stroke="#8a6a34" stroke-width="0.5"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}
