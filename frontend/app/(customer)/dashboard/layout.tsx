import CustomerShell from "../components/CustomerSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <CustomerShell>{children}</CustomerShell>;
}