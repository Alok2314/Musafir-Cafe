import React, { useState, useEffect } from 'react';
import { FeedbackItem } from '../types';
import { getFeedbacks, submitFeedback } from '../services/cafeApi';
import { INITIAL_REVIEWS } from '../data/reviewsData';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Star, MessageSquareHeart, CheckCircle2, AlertCircle, Send, ShieldCheck } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { showToast } = useToast();
  const { user, profile } = useAuth();

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_REVIEWS);
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    getFeedbacks()
      .then(data => {
        if (data && data.length > 0) {
          setFeedbacks(data);
        }
      })
      .catch(() => {
        // Unauthenticated guests use initial public testimonials
        setFeedbacks(INITIAL_REVIEWS);
      });
  }, []);

  useEffect(() => {
    if (user) {
      if (profile?.name || user.displayName) {
        setName(profile?.name || user.displayName || '');
      }
      if (user.email) {
        setEmail(user.email);
      }
    }
  }, [user, profile]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your name';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Please enter a valid email';
    if (!message.trim() || message.trim().length < 8) {
      errs.message = 'Please share your thoughts (at least 8 characters)';
    }
    if (rating < 1 || rating > 5) {
      errs.rating = 'Please choose a star rating';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newFb = await submitFeedback({
        customerId: user?.uid || 'guest',
        customerName: name.trim(),
        rating,
        message: message.trim()
      });

      setFeedbacks(prev => [newFb, ...prev]);
      setSubmittedSuccess(true);
      showToast('Thank you for your valuable feedback!', 'success');
      
      // Reset form
      setMessage('');
      setRating(5);
      setErrors({});
    } catch (err: any) {
      console.error('[FEEDBACK CREATE] Submission error:', err);
      const errMsg = err?.message || 'Database error occurred. Please try again.';
      showToast(`Failed to submit feedback: ${errMsg}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C26D2B] inline-flex items-center gap-1.5">
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Guest Experience</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2B1B14] tracking-tight">
          We Value Your Feedback
        </h1>
        <p className="text-sm sm:text-base text-[#6B5A4D]">
          Your reviews shape our beans, our recipes, and our service. Tell us about your recent visit, coffee order, or food experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        
        {/* Feedback Form Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E7DFD5] p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="font-serif text-2xl font-bold text-[#2B1B14]">
            Share Your Experience
          </h3>

          {submittedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Thank you for your valuable feedback!</strong>
                Your review has been recorded and added to our guest board.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Interactive Star Rating */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                Your Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(starValue => {
                  const isFilled = (hoveredRating || rating) >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoveredRating(starValue)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 text-stone-300 hover:scale-110 transition-transform focus:outline-none"
                      aria-label={`Rate ${starValue} stars out of 5`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-3 text-xs font-semibold text-[#3F2A1D] tabular-nums">
                  {rating} of 5 Stars
                </span>
              </div>
              {errors.rating && (
                <p className="text-xs text-rose-600 mt-1">{errors.rating}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g., Alok Sharma"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g., alok@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.email ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Order ID */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                Order ID (Optional)
              </label>
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="e.g., MC-8429 (from receipt)"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5C7B8] text-sm focus:outline-none focus:border-[#C26D2B]"
              />
              <span className="text-[11px] text-[#8C7A6B]">
                Include your order ID to earn a verified diner badge.
              </span>
            </div>

            {/* Feedback Message */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">
                Feedback Message *
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="How was the coffee aroma, food temperature, or cafe ambiance? Tell us what you loved..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                  errors.message ? 'border-rose-500 bg-rose-50/30' : 'border-[#D5C7B8] focus:border-[#C26D2B]'
                }`}
              />
              {errors.message && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#3F2A1D] hover:bg-[#2B1B14] text-white font-semibold text-sm transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting feedback...</span>
              ) : (
                <>
                  <span>Submit Feedback</span>
                  <Send className="w-4 h-4 text-[#E08A3C]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Display Guest Feedbacks Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7DFD5]">
            <h3 className="font-serif text-2xl font-bold text-[#2B1B14]">
              Recent Guest Reviews ({feedbacks.length})
            </h3>
            <span className="text-xs font-semibold text-[#C26D2B] bg-[#FFF8F0] px-3 py-1 rounded-full border border-[#FDE8D4]">
              4.9 Average Rating
            </span>
          </div>

          <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
            {feedbacks.map(fb => (
              <div
                key={fb.id}
                className="bg-white rounded-2xl border border-[#E7DFD5] p-5 space-y-3 shadow-xs transition-all hover:border-[#D5C7B8]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#2B1B14]">{fb.name}</span>
                    {fb.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified {fb.orderId ? `(${fb.orderId})` : ''}</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#8C7A6B]">{fb.date}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#5A4B40] leading-relaxed">
                  {fb.message}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
