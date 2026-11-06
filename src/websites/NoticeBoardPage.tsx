import { ArrowLeft, CalendarDays, School } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  announcementItems,
  newsItems,
  noticeBoardItems,
  upcomingEvents,
} from '@/websites/schoolNoticeData';

const NoticeBoardPage = () => (
  <div className="notice-page-enter min-h-screen bg-[#f3f0e8] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=DM+Sans:wght@400;600;700&display=swap');
      @keyframes notice-page-enter {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .notice-page-enter { animation: notice-page-enter 520ms ease-out both; }
      .all-notice-card { transition: transform 180ms ease, box-shadow 180ms ease; }
      .all-notice-card:hover, .all-notice-card:focus-visible { transform: rotate(0deg) translateY(-5px) !important; box-shadow: 7px 9px 0 #293246 !important; }
      @media (prefers-reduced-motion: reduce) {
        .notice-page-enter { animation: none; }
        .all-notice-card { transition: none; }
      }
    `}</style>

    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Demo School home"
        >
          <span className="flex h-11 w-11 items-center justify-center bg-[#17352f] text-[#f4c65f]">
            <School className="h-6 w-6" aria-hidden="true" />
          </span>
          <span>
            <strong className="block font-serif text-xl leading-none text-[#17352f] dark:text-white">
              Demo School
            </strong>
            <small className="mt-1 block text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">
              Learning with purpose
            </small>
          </span>
        </Link>
        <Button
          asChild
          variant="outline"
          className="border-[#17352f] text-[#17352f] dark:text-white"
        >
          <Link to="/#notice-board">
            <ArrowLeft aria-hidden="true" /> Back home
          </Link>
        </Button>
      </div>
    </header>

    <main>
      <section className="bg-[#17352f] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[.18em] text-[#f4c65f]">
            Demo School updates
          </p>
          <h1
            className="mt-4 text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Notice board
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
            Admissions, school dates, examinations and important information for
            families.
          </p>
        </div>
      </section>

      <section
        className="bg-white py-16 dark:bg-slate-900 lg:py-20"
        aria-labelledby="news-updates-title"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.35fr_.85fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.18em] text-[#b8751c]">
              Around the school
            </p>
            <h2
              id="news-updates-title"
              className="mt-4 font-serif text-4xl font-semibold text-[#17352f] dark:text-white sm:text-3xl"
            >
              News and updates
            </h2>

            <div className="mt-9 divide-y divide-slate-200 dark:divide-slate-700">
              {newsItems.map(item => (
                <article
                  key={`${item.day}-${item.month}-${item.title}`}
                  className="flex gap-5 py-7 first:pt-0"
                >
                  <time
                    className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-[#e8f0ee] text-[#17352f] dark:bg-slate-800 dark:text-[#f4c65f]"
                    dateTime={item.dateTime}
                  >
                    <strong className="font-serif text-3xl leading-none">
                      {item.day}
                    </strong>
                    <span className="mt-2 text-xs font-bold tracking-[.12em]">
                      {item.month}
                    </span>
                  </time>
                  <div className="pt-1">
                    <h3 className="font-serif text-xl font-semibold text-[#17352f] dark:text-white sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside
            className="self-start rounded-2xl border border-slate-200 bg-[#f3f6f9] p-6 dark:border-slate-700 dark:bg-slate-800 sm:p-8"
            aria-labelledby="upcoming-events-title"
          >
            <div className="flex items-center gap-3">
              <CalendarDays
                className="h-6 w-6 text-[#b8751c]"
                aria-hidden="true"
              />
              <h2
                id="upcoming-events-title"
                className="font-serif text-2xl font-semibold text-[#17352f] dark:text-white sm:text-3xl"
              >
                Upcoming events
              </h2>
            </div>
            <div className="mt-6 divide-y divide-slate-200 dark:divide-slate-700">
              {upcomingEvents.map(event => (
                <div
                  key={`${event.title}-${event.date}`}
                  className="flex items-center justify-between gap-5 py-5 first:pt-2"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {event.title}
                  </p>
                  <time
                    className="shrink-0 text-sm font-semibold text-slate-500 dark:text-slate-300"
                    dateTime={event.dateTime}
                  >
                    {event.date}
                  </time>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"
        aria-labelledby="school-updates-title"
      >
        <h2
          id="school-updates-title"
          className="font-serif text-3xl font-semibold text-[#17352f] dark:text-white"
        >
          School updates
        </h2>
        <div className="mt-8 grid overflow-hidden border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 md:grid-cols-3">
          {announcementItems.map(item => (
            <article
              key={item.label}
              className="flex gap-4 border-b border-slate-200 p-6 last:border-b-0 dark:border-slate-700 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <CalendarDays
                className="h-6 w-6 shrink-0 text-[#b8751c]"
                aria-hidden="true"
              />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[.14em] text-[#17352f] dark:text-white">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-5 pb-20 lg:px-8"
        aria-labelledby="important-notices-title"
      >
        <h2
          id="important-notices-title"
          className="font-serif text-3xl font-semibold text-[#17352f] dark:text-white"
        >
          Important notices
        </h2>
        <div className="mt-10 grid gap-x-12 gap-y-14 md:grid-cols-3">
          {noticeBoardItems.map(item => (
            <article
              key={item.title}
              tabIndex={0}
              className="all-notice-card relative min-h-52 rounded-md border-2 border-[#293246] p-7 pt-9 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#b8751c]"
              style={{
                backgroundColor: item.color,
                color: item.textColor,
                boxShadow: '5px 5px 0 #293246',
                transform: `rotate(${item.rotation})`,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span
                className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#293246] bg-red-600 shadow-sm"
                aria-hidden="true"
              />
              <p className="text-xs font-bold uppercase tracking-[.14em]">
                {item.label}
              </p>
              <h3
                className="mt-3 text-2xl font-bold leading-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-6">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  </div>
);

export default NoticeBoardPage;
