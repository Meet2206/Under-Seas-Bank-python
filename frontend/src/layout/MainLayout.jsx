import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import MobileDrawer from "../components/MobileDrawer"
import { getMe, getAccounts } from "../services/api"

export default function MainLayout({ children, title, subtitle }) {

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [accountType, setAccountType] = useState("Savings Account")
    const navigate = useNavigate()

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const userData = await getMe()
                setUser(userData)
                
                const accountsData = await getAccounts()
                if (accountsData && accountsData.length > 0) {
                    const savingsAcc = accountsData.find(a => a.account_type.toLowerCase() === 'savings')
                    const primaryAcc = savingsAcc || accountsData[0]
                    if (primaryAcc && primaryAcc.account_type) {
                        setAccountType(`${primaryAcc.account_type.charAt(0).toUpperCase() + primaryAcc.account_type.slice(1).toLowerCase()} Account`)
                    }
                }
            } catch (err) {
                console.error("Failed to load user info in MainLayout", err)
            }
        }
        loadUserInfo()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (

        <div className="app-layout">

            <Sidebar />

            <MobileDrawer 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                user={user}
                accountType={accountType}
                onLogout={handleLogout}
            />

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