// src/components/ui/ImageUploadField.jsx

import { useRef, useState } from "react";
import { uploadImageToCloudinary } from "../../utils/cloudinary";

/**
 * Reusable image upload field backed by Cloudinary.
 * Shows a preview once uploaded, and calls onUpload(url) with the secure URL.
 */
export default function ImageUploadField({ label, currentUrl, onUpload, aspectHint = "Any ratio" }) {
    const inputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentUrl || "");
    const [error, setError] = useState("");

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side preview before upload
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
        setError("");

        try {
            setIsUploading(true);
            const secureUrl = await uploadImageToCloudinary(file);
            setPreviewUrl(secureUrl);
            onUpload(secureUrl);
        } catch (err) {
            setError(err.message || "Upload failed.");
            setPreviewUrl(currentUrl || ""); // Revert to current on failure
        } finally {
            setIsUploading(false);
            // Reset input so same file can be re-selected if needed
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <div>
            <label className="block text-sm font-semibold mb-2 text-white">{label}</label>

            <div
                className="relative group cursor-pointer rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/50 overflow-hidden transition hover:border-indigo-500"
                onClick={() => !isUploading && inputRef.current?.click()}
            >
                {previewUrl ? (
                    <div className="relative h-40 w-full">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <p className="text-sm font-semibold text-white">
                                {isUploading ? "Uploading..." : "Click to change"}
                            </p>
                        </div>
                        {/* Upload progress overlay */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                                    <p className="text-xs text-white">Uploading...</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex h-40 flex-col items-center justify-center gap-3 text-slate-400">
                        {isUploading ? (
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                        ) : (
                            <>
                                <svg className="h-10 w-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12h.008v.008H13.5V12zm-3 4.5h9" />
                                </svg>
                                <p className="text-sm">Click to upload image</p>
                                <p className="text-xs text-slate-600">{aspectHint} · JPG, PNG, WEBP</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />

            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}
