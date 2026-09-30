import CustomerShell from "../components/CustomerSidebar";

export default function CustomerAccountLayout({ children }: { children: React.ReactNode;}) {
    return <CustomerShell>{children}</CustomerShell>;
}