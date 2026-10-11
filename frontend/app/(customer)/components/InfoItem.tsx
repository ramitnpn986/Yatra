import type { ReactNode } from "react";

const formatValue = ( value: ReactNode): ReactNode => {
    if ( value === undefined ||   value === null ||   value === "") {
        return "Not provided";
    }
    return value;
};

export const InfoItem = ({ label, value, layout = "default"}: {
    label: string;
    value?: ReactNode;
    layout?: "default" | "horizontal";
}) => {
    const formattedValue = formatValue(value);

    if (layout === "horizontal") {
        return (
            <div className="flex items-center justify-between gap-4">
                <p className="mb-1 text-xs font-semibold text-gray-500">
                    {label}
                </p>

                <div className="text-right text-sm font-medium text-gray-900">
                    {formattedValue}
                </div>
            </div>
        );
    }

    return (
        <div className="min-w-0">
            <p className="text-sm text-gray-500">
                {label}
            </p>

            <div className="mt-1 break-words text-sm font-semibold text-gray-900">
                {formattedValue}
            </div>
        </div>
    );
};