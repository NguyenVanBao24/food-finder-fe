'use client';

import { useComments } from '@/lib/hooks/use-comments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { CommentForm } from './comment-form';
import { useAuthStore } from '@/lib/store/auth-store';

interface CommentsListProps {
    locationId: string;
}

function CommentItem({ comment }: { comment: any }) {
    return (
        <div className="flex gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
            <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={comment.user?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {comment.user?.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-gray-900">
                        {comment.user?.full_name || comment.user?.email?.split('@')[0] || 'User'}
                    </h4>
                    <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: vi })}
                    </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {comment.content}
                </p>
                <div className="flex gap-4 pt-2">
                    <button className="text-xs font-medium text-gray-500 hover:text-primary flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" /> Thích
                    </button>
                    <button className="text-xs font-medium text-gray-500 hover:text-primary">
                        Trả lời
                    </button>
                </div>
            </div>
        </div>
    );
}

export function CommentsList({ locationId }: CommentsListProps) {
    const { comments, isLoading, isError } = useComments(locationId);
    const { user } = useAuthStore();

    if (isLoading) return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
    if (isError) return <div className="text-red-500 text-sm p-4">Không thể tải bình luận.</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Đánh giá ({comments.length})
                </h3>
            </div>

            {user ? (
                <div className="space-y-6">
                    <h4 className="font-semibold text-sm text-gray-700">Viết đánh giá của bạn</h4>
                    <CommentForm locationId={locationId} />
                </div>
            ) : (
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/10 text-center">
                    <p className="text-sm text-gray-600 mb-3">Vui lòng đăng nhập để viết đánh giá</p>
                    <Link href="/login">
                        <Button size="sm">Đăng nhập ngay</Button>
                    </Link>
                </div>
            )}

            <div className="space-y-4 pt-4">
                {comments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8 italic">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))
                )}
            </div>
        </div>
    );
}
