export default function BankCard({ type, balance, cardNumber, holderName, onClick }) {
    const isAbyss = type === "abyss";
    const isCurrent = type === "current";
    const isShoal = type === "shoal";

    let tierName = "Shoal";
    let tierSub = "Everyday Debit";
    let textColor = "#F4FBFA";
    let subColor = "#EAFBF7";

    if (isCurrent) {
        tierName = "Current";
        tierSub = "Premium Debit";
        textColor = "#F4FBFA";
        subColor = "#E3D8F5";
    } else if (isAbyss) {
        tierName = "Abyss";
        tierSub = "Signature Credit";
        textColor = "#F3D89A";
        subColor = "#C7AD79";
    }

    return (
        <div className={`new-bank-card ${type}`} onClick={onClick}>
            {isShoal && (
                <svg viewBox="0 0 360 227" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="skyShoal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#CDEFE6"/>
                      <stop offset="45%" stop-color="#5FC2C9"/>
                      <stop offset="100%" stop-color="#12707F"/>
                    </linearGradient>
                    <radialGradient id="sunShoal" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#FFE1B8"/>
                      <stop offset="60%" stop-color="#FF9B5C"/>
                      <stop offset="100%" stop-color="#FF9B5C" stop-opacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="360" height="227" fill="url(#skyShoal)"/>
                  <circle cx="270" cy="58" r="46" fill="url(#sunShoal)"/>
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

            {isCurrent && (
                <svg viewBox="0 0 360 227" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="skyCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#6A5AA8"/>
                      <stop offset="50%" stop-color="#3B2E72"/>
                      <stop offset="100%" stop-color="#170F3A"/>
                    </linearGradient>
                    <radialGradient id="glowCurrent" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#FBD9A8"/>
                      <stop offset="55%" stop-color="#E888B0"/>
                      <stop offset="100%" stop-color="#E888B0" stop-opacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="360" height="227" fill="url(#skyCurrent)"/>
                  <circle cx="270" cy="55" r="48" fill="url(#glowCurrent)"/>
                  <circle cx="270" cy="55" r="18" fill="#FCE3C2"/>
                  <g opacity="0.9">
                    <ellipse cx="70" cy="55" rx="16" ry="11" fill="#F3B4D6"/>
                    <path d="M58 60 Q60 78 56 92 M66 63 Q66 80 64 95 M74 63 Q76 80 78 95 M82 60 Q84 78 88 92" stroke="#F3B4D6" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
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

            {isAbyss && (
                <svg viewBox="0 0 360 227" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="skyAbyss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#171208"/>
                      <stop offset="100%" stop-color="#050402"/>
                    </linearGradient>
                    <radialGradient id="glowAbyss" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#FBE7B4"/>
                      <stop offset="55%" stop-color="#D9B36C"/>
                      <stop offset="100%" stop-color="#D9B36C" stop-opacity="0"/>
                    </radialGradient>
                  </defs>
                  <rect width="360" height="227" fill="url(#skyAbyss)"/>
                  <circle cx="270" cy="55" r="50" fill="url(#glowAbyss)"/>
                  <circle cx="270" cy="55" r="16" fill="#FCEFC9"/>
                  <g fill="#0B0906">
                    <path d="M55 70 Q40 55 25 62 Q40 68 40 78 Q40 88 25 94 Q40 101 55 86 Q66 92 62 78 Q66 64 55 70 Z"/>
                    <circle cx="46" cy="74" r="2" fill="#2FE6C4"/>
                  </g>
                  <path d="M55 68 Q40 40 34 30" stroke="#0B0906" stroke-width="2.5" fill="none" stroke-linecap="round"/>
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
                        <rect x="0.5" y="0.5" width="25" height="18" rx="3.5" fill="#F3D89A" stroke="#8a6a34" stroke-width="0.5"/>
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
