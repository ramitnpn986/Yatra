  const formatValue = ( value: string | number | undefined | null) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "Not provided";
    }

    return value;
  };


export const InfoItem = ({ label, value}: { label: string; value?: string | number }) => (
    <div className=" flex items-center justify-between">
        <div className="mb-1 text-xs font-semibold  text-gray-500">   {label} </div>
        <div className="text-sm font-medium text-gray-900">  {formatValue(value)}</div>
    </div>
);
