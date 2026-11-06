import { ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    question: 'How can I apply for admission?',
    answer:
      'Begin with the online enquiry form. Our admissions team will contact you, explain availability for the relevant class and guide you through the application process.',
  },
  {
    question: 'Which year groups does the school offer?',
    answer:
      'KD Public School supports children from the early years through senior school. Contact admissions to confirm availability for your child’s current class.',
  },
  {
    question: 'Can our family visit the campus?',
    answer:
      'Yes. Families can arrange a weekday campus visit with the admissions office to see the learning spaces and speak with the school team.',
  },
  {
    question: 'Which documents are needed for admission?',
    answer:
      'Document requirements can vary by class. The admissions team will provide the correct checklist after receiving your enquiry.',
  },
  {
    question: 'Does the school provide transport?',
    answer:
      'Transport options depend on route availability and your location. Share your area in the enquiry form and the school team will confirm the available service.',
  },
  {
    question: 'What can parents access through the portal?',
    answer:
      'The Parent Portal provides secure access to attendance, fees, results and important student information in one place.',
  },
];

const FaqSection = () => (
  <section id="faqs" className="bg-[#f7f3e8] py-16 lg:py-20" data-reveal>
    <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[.75fr_1.25fr] lg:gap-16 lg:px-8">
      <div className="lg:sticky lg:top-36 lg:self-start">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-[#7a1724]">
          Need to know
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#071f3d] sm:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
          Quick answers for families considering KD Public School. Our
          admissions team is available if you need more help.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-7 bg-[#7a1724] font-bold text-white hover:bg-[#64121d]"
        >
          <Link to="/enquiry">
            Ask a question <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            open={index === 0}
            className="group border border-[#7a1724]/15 bg-white px-5 py-4 shadow-sm transition-shadow open:shadow-md sm:px-6"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-semibold text-[#071f3d] marker:content-none">
              {faq.question}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#d4a62f]/15 text-[#7a1724]">
                <Plus
                  className="size-4 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                />
              </span>
            </summary>
            <p className="max-w-2xl pt-4 pr-10 text-sm leading-6 text-slate-600">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection;
