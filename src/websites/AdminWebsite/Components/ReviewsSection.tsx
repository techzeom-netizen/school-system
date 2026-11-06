import { Star } from 'lucide-react';
import { reviews } from './employerPortalData';
import SectionHeading from './SectionHeading';

const ReviewsSection = () => (
  <section
    className="bg-blue-100/60 dark:bg-blue-950/50 py-16 lg:py-20"
    aria-labelledby="reviews-title"
  >
    <div className="mx-auto w-full max-w-[1560px] px-5 lg:px-8">
      <SectionHeading
        id="reviews-title"
        eyebrow="Reviews"
        title="Loved by hiring teams"
        subtitle="School teams use KD Public School to bring clarity and speed to everyday operations."
      />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {reviews.map(review => (
          <article
            key={review.name}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm"
          >
            <div className="flex text-orange-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
              &quot;{review.quote}&quot;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-sm font-bold text-blue-700 dark:text-blue-400">
                {review.initials}
              </span>
              <div>
                <h3 className="font-bold text-slate-950 dark:text-slate-100">
                  {review.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {review.role}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsSection;
