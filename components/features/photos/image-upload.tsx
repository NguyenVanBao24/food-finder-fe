'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    className?: string;
}

export function ImageUpload({ onUpload, className }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
            alert('Cloudinary configurations are missing. Please check .env.local');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', cloudinaryUploadPreset);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                onUpload(data.secure_url);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            alert('Không thể upload ảnh. Vui lòng thử lại.');
            setPreview(null);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
            />

            {!preview ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <ImagePlus className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-gray-700">Thêm ảnh mới</p>
                        <p className="text-sm text-gray-400">Click để chọn ảnh từ máy của bạn</p>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 group">
                    <img
                        src={preview}
                        alt="Upload preview"
                        className={cn(
                            "w-full h-full object-cover transition-opacity",
                            uploading ? "opacity-50" : "opacity-100"
                        )}
                    />

                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    )}

                    {!uploading && (
                        <button
                            onClick={() => setPreview(null)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
