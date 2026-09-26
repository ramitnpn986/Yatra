export const StatusBadge = ({ value, type = "default"}: { value: string; type?: "success" | "error" | "warning" | "default"}) => {
    const styles = {
      success: "bg-green-100 text-green-700",
      error: "bg-red-100 text-red-700",
      warning: "bg-yellow-100 text-yellow-700",
      default: "bg-gray-100 text-gray-700",
    };

    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[type]}`}>
        {value}
      </span>
    );
  };