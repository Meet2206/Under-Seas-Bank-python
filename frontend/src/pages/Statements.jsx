import MainLayout from "../layout/MainLayout"

export default function Statements() {
    return (
        <MainLayout title="Bank Statements" subtitle="View and download your monthly bank statements">
            <div className="panel" style={{ padding: "40px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>📄</div>
                <h2>Bank Statements</h2>
                <p style={{ color: "var(--gray-400)", maxWidth: "480px", margin: "10px auto 0" }}>
                    Your electronic statements are generated on the 1st of every month. This feature is coming soon.
                </p>
            </div>
        </MainLayout>
    )
}
