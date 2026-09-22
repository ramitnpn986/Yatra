import {  FileText,  Upload,  X} from "lucide-react";
import Image from "next/image";
import React from "react";

export type FileField =
    | "citizenshipCard"
    | "drivingLicense"
    | "vehicleRegistration"
    | "vehiclePhoto";

interface FileUploadFieldProps {
    label: string;
    name: FileField;
    formData: {
        citizenshipCard: File | null;
        drivingLicense: File | null;
        vehicleRegistration: File | null;
        vehiclePhoto: File | null;
    };

    errors: Record<FileField, string>;
    previews: Record<FileField, string | null>;

    changeFileHandler: (e: React.ChangeEvent<HTMLInputElement>, fieldName: FileField) => void;
    removeFile: (fieldName: FileField) => void;
}

const FileUploadField = ({ label, name, errors, previews, changeFileHandler, removeFile}: FileUploadFieldProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                {label}
            </label>

            <div className={`relative  rounded-2xl h-44 flex flex-col items-center justify-center overflow-hidden
                ${
                    errors[name]
                        ? "border-red-300 bg-red-50"
                        : previews[name]
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-orange-400 hover:bg-slate-50"
                }`}
            >
                {previews[name] ? (
                    <>
                        {previews[name] === "pdf-placeholder" ? (
                            <div className="flex flex-col items-center text-slate-500">
                                <FileText size={40} />
                                <span className="text-xs mt-2">  PDF Document </span>
                            </div>
                        ) : (
                            <Image
                                src={previews[name] as string}
                                alt={`${label} preview`}
                                className="w-full h-full object-cover"
                            />
                        )}

                        <button type="button" onClick={() => removeFile(name)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg  transition-colors">
                            <X size={16} />
                        </button>
                    </>
                ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                        <div className="p-3 bg-slate-100 rounded-full text-slate-500 group-hover:scale-110 transition-transform duration-200">
                            <Upload size={24} />
                        </div>
                        <span className="text-xs font-medium text-slate-500 mt-2"> Click to upload </span>
                        <input  type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => changeFileHandler(e, name) }/>
                    </label>
                )}
            </div>

            {errors[name] && (
                <p className="text-red-500 text-xs mt-1 font-medium"> {errors[name]} </p>
            )}
        </div>
    );
};

export default FileUploadField;