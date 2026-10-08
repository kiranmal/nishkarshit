"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReviewAction, type ReviewFormState } from "@/app/actions/review";

export default function ReviewForm({
  listingId,
  listingSlug,
}: {
  listingId: string;
  listingSlug: string;
}) {
  const [rating, setRating] = useState(5);
  const action = submitReviewAction.bind(null, listingId, listingSlug);
  const [state, formAction, pending] = useActionState<ReviewFormState, FormData>(
    action,
    null
  );

  if (state?.success) {
    return (
      <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">
        Thanks for your review!
      </p>
    );
  }

  return (
    <form action={formAction} className="border border-gray-100 rounded-xl p-5 space-y-3">
      <p className="text-sm font-semibold text-gray-900">Leave a review</p>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            aria-label={`${i + 1} star`}
          >
            <Star
              size={20}
              fill={i < rating ? "currentColor" : "none"}
              className={i < rating ? "text-amber-400" : "text-gray-300"}
            />
          </button>
        ))}
        <input type="hidden" name="rating" value={rating} />
      </div>
      <input name="name" required placeholder="Your name" className="input" />
      <textarea name="comment" required placeholder="Your review" rows={3} className="input" />
      {state?.error && <p className="text-xs text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
