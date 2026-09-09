import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MessageSquarePlus, ThumbsUp } from 'lucide-react';
import { storage } from '../../lib/storage';
import { INITIAL_REVIEWS } from '../../data/reviews';
import { formatDate } from '../../lib/utils';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useNotification } from '../../context/NotificationContext';
import type { Review, Product } from '../../types';

export interface ReviewsSectionProps {
  product: Product;
}

export function ReviewsSection({ product }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useNotification();

  // Load reviews: seed initial reviews + user-submitted reviews from storage
  useEffect(() => {
    const userReviews = storage.getUserReviews();
    const all = [...userReviews, ...INITIAL_REVIEWS];
    const productReviews = all.filter((r) => r.productId === product.id);
    setReviews(productReviews);
  }, [product.id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      setError('Please write at least 5 characters in your review.');
      return;
    }
    if (comment.length > 500) {
      setError('Review comment cannot exceed 500 characters.');
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      authorName: authorName.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };

    storage.addUserReview(newReview);
    setReviews((prev) => [newReview, ...prev]);
    setIsModalOpen(false);
    setAuthorName('');
    setComment('');
    setRating(5);
    setError(null);

    showToast({
      type: 'success',
      title: 'Review Submitted',
      message: 'Thank you for sharing your feedback on this product!',
    });
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating;

  return (
    <div className="space-y-6 pt-6 border-t border-stone-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900">Customer Reviews</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Verified feedback from genuine FreshCart shoppers
          </p>
        </div>
        <Button
          type="button"
          id="write-review-btn"
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4 mr-1" />
          Write a Review
        </Button>
      </div>

      {/* Rating Snapshot Card */}
      <div className="flex items-center gap-6 p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
        <div className="text-center sm:text-left">
          <div className="text-3xl font-extrabold text-stone-900 leading-none">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex items-center text-amber-400 my-1.5 justify-center sm:justify-start">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(avgRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-stone-200 text-stone-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-stone-500 font-medium">
            Based on {reviews.length} community reviews
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-sm">
            Be the first to review this item! Click "Write a Review" above.
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-stone-100 bg-white hover:border-stone-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">{rev.authorName}</span>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-400">{formatDate(rev.createdAt)}</span>
              </div>

              <div className="flex items-center text-amber-400 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-stone-200 text-stone-200'
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Write a Customer Review"
        description={`Share your experience with ${product.name}`}
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Rachel Adams"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-stone-200 text-stone-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-stone-700 ml-2">{rating} of 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Review Comment *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? Freshness, taste, quality..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
            <p className="text-[11px] text-stone-400 text-right mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Publish Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
