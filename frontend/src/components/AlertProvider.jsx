import React, { createContext, useState, useEffect, useRef } from "react";

export const AlertContext = createContext();

export default function AlertProvider({ children }) {
    const [modalConfig, setModalConfig] = useState(null); // { message, type, title, details }
    const [toasts, setToasts] = useState([]); // array of { id, message, type, title, details, timestamp }

    // Global helper to show alerts
    const showCustomAlert = (message, type = "info", details = null, title = null) => {
        const isMobile = window.innerWidth <= 768;
        
        let defaultTitle = "Notification";
        if (type === "success") defaultTitle = "Successful";
        else if (type === "error") defaultTitle = "Error Occurred";
        
        const finalTitle = title || defaultTitle;

        if (isMobile) {
            const id = Date.now() + Math.random();
            const newToast = {
                id,
                message,
                type,
                title: finalTitle,
                details,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setToasts(prev => [...prev, newToast]);
        } else {
            setModalConfig({ message, type, title: finalTitle, details });
        }
    };

    // Expose helpers globally & override window.alert
    useEffect(() => {
        const originalAlert = window.alert;
        
        window.alert = (msg) => {
            let type = "info";
            let details = null;
            if (typeof msg === "string") {
                const lower = msg.toLowerCase();
                if (lower.includes("successful") || lower.includes("success")) {
                    type = "success";
                } else if (
                    lower.includes("fail") ||
                    lower.includes("error") ||
                    lower.includes("invalid") ||
                    lower.includes("insufficient") ||
                    lower.includes("cannot") ||
                    lower.includes("not found")
                ) {
                    type = "error";
                }
            }
            showCustomAlert(msg, type, details);
        };

        window.showRichAlert = (config) => {
            // config: { title, message, type, details }
            showCustomAlert(config.message, config.type, config.details, config.title);
        };

        return () => {
            window.alert = originalAlert;
            delete window.showRichAlert;
        };
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showCustomAlert }}>
            {children}
            
            {/* Desktop Modal Portal/Overlay */}
            {modalConfig && (
                <DesktopModal config={modalConfig} onClose={() => setModalConfig(null)} />
            )}

            {/* Mobile Toast Stack Container */}
            <div className="mobile-toast-container">
                {toasts.map(toast => (
                    <MobileToast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
                ))}
            </div>
        </AlertContext.Provider>
    );
}

// ── DESKTOP CENTER MODAL ──
function DesktopModal({ config, onClose }) {
    const modalRef = useRef(null);
    const firstBtnRef = useRef(null);

    // Close on ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Trap focus inside modal
    useEffect(() => {
        if (firstBtnRef.current) firstBtnRef.current.focus();

        const handleFocusTrap = (e) => {
            if (!modalRef.current) return;
            const focusable = modalRef.current.querySelectorAll("button, [href], input, select, textarea");
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.key === "Tab") {
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        last.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === last) {
                        first.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        window.addEventListener("keydown", handleFocusTrap);
        return () => window.removeEventListener("keydown", handleFocusTrap);
    }, []);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const isSuccess = config.type === "success";
    const isError = config.type === "error";

    // Create bubbles dynamically
    const bubbleElements = Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 6 + 4;
        const delay = Math.random() * 0.8;
        const left = Math.random() * 100;
        return (
            <span
                key={i}
                className="modal-bubble"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    animationDelay: `${delay}s`
                }}
            />
        );
    });

    return (
        <div className="onboarding-modal-overlay" onClick={handleBackdropClick} style={{ cursor: "pointer" }}>
            <div 
                className="luxury-modal-card" 
                ref={modalRef} 
                style={{ cursor: "default" }}
                role="dialog"
                aria-modal="true"
            >
                {/* Bubble Container */}
                <div className="modal-bubbles-container">
                    {bubbleElements}
                </div>

                {/* Animated circular success icon / error icon */}
                <div className="modal-header-icon-container">
                    <div className={`modal-status-icon ${config.type}`}>
                        {isSuccess ? (
                            <svg className="modal-svg-check" viewBox="0 0 24 24">
                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : isError ? (
                            <svg className="modal-svg-cross" viewBox="0 0 24 24">
                                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                            </svg>
                        ) : (
                            <svg className="modal-svg-info" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
                                <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" />
                            </svg>
                        )}
                    </div>
                </div>

                <h2>{config.title}</h2>
                <p className="modal-message-body">{config.message}</p>

                {/* Rich Details Block */}
                {config.details && (
                    <div className="modal-details-container">
                        {config.details.amount && (
                            <div className="modal-detail-row amount-row">
                                <span className="modal-detail-label">Amount</span>
                                <span className="modal-detail-val amount-val">₹{Number(config.details.amount).toLocaleString()}</span>
                            </div>
                        )}
                        {config.details.recipient && (
                            <>
                                <div className="modal-detail-divider" />
                                <div className="modal-detail-row">
                                    <span className="modal-detail-label">Recipient</span>
                                    <span className="modal-detail-val">{config.details.recipient}</span>
                                </div>
                            </>
                        )}
                        {config.details.reference && (
                            <>
                                <div className="modal-detail-divider" />
                                <div className="modal-detail-row">
                                    <span className="modal-detail-label">Reference</span>
                                    <span className="modal-detail-val mono">{config.details.reference}</span>
                                </div>
                            </>
                        )}
                        {config.details.balance !== undefined && config.details.balance !== null && (
                            <>
                                <div className="modal-detail-divider" />
                                <div className="modal-detail-row">
                                    <span className="modal-detail-label">Available Balance</span>
                                    <span className="modal-detail-val">₹{Number(config.details.balance).toLocaleString()}</span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <button 
                    className="luxury-modal-button" 
                    ref={firstBtnRef}
                    onClick={onClose}
                >
                    Done
                </button>

                <button 
                    className="luxury-modal-receipt-link"
                    onClick={() => {
                        window.alert("Receipt downloads will be enabled shortly.");
                    }}
                >
                    View Transaction Receipt
                </button>
            </div>
        </div>
    );
}

// ── MOBILE TOAST NOTIFICATION ──
function MobileToast({ toast, onDismiss }) {
    const [startX, setStartX] = useState(null);
    const [currentX, setCurrentX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const timerRef = useRef(null);

    // Auto dismiss after 4 seconds
    const startTimer = () => {
        timerRef.current = setTimeout(() => {
            onDismiss();
        }, 4000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, []);

    // Swipe handlers
    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
        stopTimer();
    };

    const handleTouchMove = (e) => {
        if (!startX) return;
        const diffX = e.touches[0].clientX - startX;
        // only swipe right or left
        setCurrentX(diffX);
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        if (Math.abs(currentX) > 100) {
            // swipe away
            onDismiss();
        } else {
            // snap back
            setCurrentX(0);
            startTimer();
        }
        setStartX(null);
    };

    const isSuccess = toast.type === "success";
    const isError = toast.type === "error";

    // Generate bubbles
    const bubbleElements = Array.from({ length: 8 }).map((_, i) => {
        const size = Math.random() * 4 + 2;
        const delay = Math.random() * 0.5;
        const left = Math.random() * 100;
        return (
            <span
                key={i}
                className="toast-bubble"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    animationDelay: `${delay}s`
                }}
            />
        );
    });

    return (
        <div
            className="mobile-toast-item"
            style={{
                transform: `translateX(${currentX}px) scale(${isSwiping ? 0.98 : 1})`,
                opacity: 1 - Math.abs(currentX) / 300,
                transition: isSwiping ? "none" : "transform 0.25s ease, opacity 0.25s ease"
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={stopTimer}
            onMouseLeave={startTimer}
        >
            {/* Bubbles */}
            <div className="toast-bubbles-container">
                {bubbleElements}
            </div>

            <div className="mobile-toast-header">
                <div className={`toast-status-icon ${toast.type}`}>
                    {isSuccess ? (
                        <svg viewBox="0 0 24 24">
                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : isError ? (
                        <svg viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round" />
                            <line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round" />
                        </svg>
                    )}
                </div>
                <div className="mobile-toast-title-group">
                    <h3>{toast.title}</h3>
                    <span className="toast-timestamp">{toast.timestamp}</span>
                </div>
            </div>

            <div className="mobile-toast-body">
                <p>{toast.message}</p>
                {toast.details && toast.details.amount && (
                    <p style={{ marginTop: "4px", fontWeight: "600", color: "#5CEBD8" }}>
                        ₹{Number(toast.details.amount).toLocaleString()} {toast.details.recipient ? `to ${toast.details.recipient}` : ''}
                    </p>
                )}
            </div>

            <div className="mobile-toast-footer">
                <span className="toast-view-details-link">View Details →</span>
            </div>
        </div>
    );
}
