import MainLayout from "../layout/MainLayout"

export default function Settings() {
    return (
        <MainLayout title="Settings" subtitle="Manage your account settings and security preferences">
            <div className="panel" style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚙️</div>
                <h2>Settings & Security</h2>
                <p style={{ color: "var(--gray-400)", maxWidth: "480px", margin: "10px auto 0" }}>
                    Customize your banking profile, security settings, and notification channels. This feature is coming soon.
                </p>
            </div>
        </MainLayout>
    )
}
