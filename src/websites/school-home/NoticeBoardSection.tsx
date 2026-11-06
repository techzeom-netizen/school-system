import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { noticeBoardItems } from '@/websites/schoolNoticeData';

const NoticeBoardSection = () => (
  <section
    id="notice-board"
    className="bg-[#f7f3e8] px-5 py-20 lg:px-8 lg:py-24"
    data-reveal
  >
    <style>{`
      .notice-note { transition: transform 180ms ease, box-shadow 180ms ease; }
      .notice-note:hover, .notice-note:focus-visible { transform: rotate(0deg) translateY(-6px) !important; box-shadow: 7px 9px 0 #293246 !important; }
      @media (prefers-reduced-motion: reduce) { .notice-note { transition: none; } }
    `}</style>
    <div className="mx-auto max-w-7xl">
      <div>
        <p className="text-sm font-bold uppercase tracking-[.18em] text-[#7a1724]">
          Latest updates
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#071f3d] sm:text-3xl">
          Notice board
        </h2>
      </div>
      <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-3">
        {noticeBoardItems.map(item => (
          <article
            key={item.title}
            tabIndex={0}
            className="notice-note relative min-h-52 rounded-md border-2 border-[#293246] p-7 pt-9 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#7a1724]"
            style={{
              backgroundColor: item.color,
              color: item.textColor,
              boxShadow: '5px 5px 0 #293246',
              transform: `rotate(${item.rotation})`,
            }}
          >
            <span
              className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#293246] bg-red-600 shadow-sm"
              aria-hidden="true"
            />
            <p className="text-xs font-bold uppercase tracking-[.14em]">
              {item.label}
            </p>
            <h3 className="mt-3 text-lg font-bold leading-tight">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-6">{item.text}</p>
          </article>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Button
          asChild
          className="bg-[#7a1724] px-7 text-white hover:bg-[#5b101a]"
        >
          <Link to="/notice-board">
            Show all <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

export default NoticeBoardSection;
