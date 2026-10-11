type StatusType = "success" | "error" | "warning" | "default";

const statusStyle: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
    active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    completed: "bg-green-50 text-green-700 ring-green-200",
    rejected: "bg-red-50 text-red-700 ring-red-200",

    unpaid: "bg-amber-50 text-amber-700 ring-amber-200",
    deposit_paid: "bg-blue-50 text-blue-700 ring-blue-200",
    fully_paid: "bg-green-50 text-green-700 ring-green-200",
    refunded: "bg-purple-50 text-purple-700 ring-purple-200",


    success: "bg-green-100 text-green-700 ring-green-200",
    error: "bg-red-100 text-red-700 ring-red-200",
    warning: "bg-yellow-100 text-yellow-700 ring-yellow-200",
    default: "bg-gray-100 text-gray-700 ring-gray-200",
};

const typeFallback: Record<StatusType, string> = {
    success: statusStyle.success,
    error: statusStyle.error,
    warning: statusStyle.warning,
    default: statusStyle.default,
};

export const StatusBadge = ({  value, type = "default"}: {
    value: string;
    type?: StatusType;
}) => {
    const normalizedValue = value.toLowerCase().trim();
    const styles = statusStyle[normalizedValue] ?? typeFallback[type];

    const label = normalizedValue.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return (
        <span  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}>
            {label}
        </span>
    );
};