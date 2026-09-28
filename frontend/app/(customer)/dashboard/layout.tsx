import CustomerShell from "../components/CustomerShell";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <CustomerShell>{children}</CustomerShell>;
}