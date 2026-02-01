'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';
import { useComments } from '@/lib/hooks/use-comments';
import { Loader2, Send } from 'lucide-react';

interface CommentFormProps {
    locationId: string;
}

export function CommentForm({ locationId }: CommentFormProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();
    const { mutate } = useComments(locationId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !user) return;

        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${locationId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ content }),
            });

            if (!res.ok) throw new Error('Failed to post comment');

            setContent('');
            mutate(); // Refresh comments list
        } catch (err) {
            console.error('Failed to post comment', err);
            alert('Không thể gửi bình luận. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
                className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm"
                placeholder="Chia sẻ trải nghiệm của bạn về địa điểm này..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
            />
            <div className="flex justify-end">
                <Button disabled={loading || !content.trim()} type="submit" size="sm">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            Gửi bình luận <Send className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
