import { Location } from '@/lib/types';
import { Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ImageUpload } from '@/components/features/photos/image-upload';
import { useAuthStore } from '@/lib/store/auth-store';
import { supabase } from '@/lib/supabase/client';

interface PhotoGalleryProps {
    photos: any[];
    locationId: string;
    onRefresh?: () => void;
}

export function PhotoGallery({ photos, locationId, onRefresh }: PhotoGalleryProps) {
    const { user } = useAuthStore();
    const [isUploading, setIsUploading] = useState(false);

    const handlePhotoUploaded = async (url: string) => {
        setIsUploading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/photos/location/${locationId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ url }),
            });

            if (!res.ok) throw new Error('Failed to save photo to database');

            if (onRefresh) onRefresh();
        } catch (error) {
            console.error('Error saving photo:', error);
            alert('Lưu ảnh thất bại. Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Hình ảnh ({photos.length})
                </h3>
                {user && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-primary border-primary/20 hover:bg-primary/5"
                        onClick={() => document.getElementById('photo-upload-trigger')?.click()}
                    >
                        Thêm ảnh
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.map((photo, index) => (
                    <div
                        key={photo.id || index}
                        className="aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group relative shadow-sm border border-gray-100"
                    >
                        <img
                            src={photo.url}
                            alt="Location photo"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                ))}

                {user && (
                    <div className="hidden">
                        <ImageUpload
                            onUpload={handlePhotoUploaded}
                            className="hidden"
                        />
                        <button id="photo-upload-trigger" onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()} />
                    </div>
                )}

                {user && photos.length < 8 && (
                    <div
                        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover:text-primary">Thêm ảnh</span>
                    </div>
                )}
            </div>
        </div>
    );
}
