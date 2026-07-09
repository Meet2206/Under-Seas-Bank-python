import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"

export default function MainLayout({ children, title, subtitle }) {

    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (

        <div className="app-layout">

            {/* Mobile overlay — tap to close sidebar */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="app-main">

                <Header
                    title={title}
                    subtitle={subtitle}
                    onMenuToggle={() => setSidebarOpen(prev => !prev)}
                />

                <div className="app-content">
                    {children}
                </div>

            </div>

        </div>

    )

}