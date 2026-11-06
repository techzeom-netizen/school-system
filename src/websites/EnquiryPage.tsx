import { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  Clock3,
  GraduationCap,
  Mail,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';

const initialForm = {
  parentName: '',
  studentName: '',
  email: '',
  phone: '',
  grade: '',
  enquiryType: '',
  message: '',
  consent: false,
};

type EnquiryForm = typeof initialForm;
type TextField = Exclude<keyof EnquiryForm, 'consent'>;

const EnquiryPage = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const updateField = (name: TextField) => (value: string) => {
    setSubmitted(false);
    setError('');
    setForm(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requiredFields: TextField[] = [
      'parentName',
      'email',
      'phone',
      'grade',
      'enquiryType',
      'message',
    ];

    if (requiredFields.some(field => !form[field].trim()) || !form.consent) {
      setError(
        'Please complete every required field and accept the contact consent.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number with at least 10 digits.');
      return;
    }

    const lead = {
      ...form,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      submittedAt: new Date().toISOString(),
      status: 'new',
    };

    try {
      const storedLeads = JSON.parse(
        localStorage.getItem('demo-school-enquiry-leads') || '[]'
      ) as unknown[];
      localStorage.setItem(
        'demo-school-enquiry-leads',
        JSON.stringify([...storedLeads, lead])
      );
    } catch {
      localStorage.setItem('demo-school-enquiry-leads', JSON.stringify([lead]));
    }

    setForm(initialForm);
    setSubmitted(true);
    setError('');
  };

  return (
    <div className="enquiry-page-enter min-h-screen bg-[#f3f0e8] text-slate-800">
      <style>{`
        @keyframes enquiry-page-enter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .enquiry-page-enter { animation: enquiry-page-enter 520ms ease-out both; }
        @media (prefers-reduced-motion: reduce) { .enquiry-page-enter { animation: none; } }
      `}</style>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="Demo School home"
          >
            <span className="flex h-11 w-11 items-center justify-center bg-[#17352f] text-[#f4c65f]">
              <GraduationCap className="h-6 w-6" aria-hidden="true" />
            </span>
            <span>
              <strong className="block font-serif text-xl leading-none text-[#17352f]">
                Demo School
              </strong>
              <small className="mt-1 block text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">
                Admission enquiry
              </small>
            </span>
          </Link>
          <Button
            asChild
            variant="outline"
            className="border-[#17352f] text-[#17352f]"
          >
            <Link to="/">
              <ArrowLeft aria-hidden="true" /> Back home
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl items-start gap-8 px-5 py-10 lg:grid-cols-[.72fr_1.28fr] lg:px-8 lg:py-16">
        <section className="rounded-lg bg-[#17352f] p-7 text-white shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#f4c65f]">
            Admissions 2027-28
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-2xl">
            Let us help you find the right place for your child.
          </h1>
          <p className="mt-6 leading-5 text-white/75">
            Tell us what you would like to know. Our admissions team can help
            with classes, fees, transport, campus visits and the application
            process.
          </p>

          <div className="mt-10 grid gap-4">
            <div className="flex gap-4 rounded-md border border-white/15 bg-white/5 p-4">
              <Mail
                className="mt-0.5 h-5 w-5 shrink-0 text-[#f4c65f]"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Email
                </p>
                <a
                  className="mt-1 block font-semibold"
                  href="mailto:admissions@demo-school.edu"
                >
                  admissions@demo-school.edu
                </a>
              </div>
            </div>
            <div className="flex gap-4 rounded-md border border-white/15 bg-white/5 p-4">
              <Phone
                className="mt-0.5 h-5 w-5 shrink-0 text-[#f4c65f]"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Phone
                </p>
                <a
                  className="mt-1 block font-semibold"
                  href="tel:+919876543210"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
            <div className="flex gap-4 rounded-md border border-white/15 bg-white/5 p-4">
              <Clock3
                className="mt-0.5 h-5 w-5 shrink-0 text-[#f4c65f]"
                aria-hidden="true"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Response time
                </p>
                <p className="mt-1 font-semibold">Within one school day</p>
              </div>
            </div>
          </div>

          <p className="mt-8 flex items-start gap-3 text-sm leading-6 text-white/70">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-[#f4c65f]"
              aria-hidden="true"
            />
            Your information is used only to respond to this admission enquiry.
          </p>
        </section>

        <section
          className="self-start rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
          aria-labelledby="enquiry-form-title"
        >
          <h2
            id="enquiry-form-title"
            className="font-serif text-3xl font-semibold text-[#17352f]"
          >
            Send an enquiry
          </h2>
          <p className="mt-3 text-slate-600">
            Complete the form and the school admissions team will contact you.
          </p>

          <form className="mt-8" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Parent or guardian name"
                name="parentName"
                value={form.parentName}
                onChange={updateField('parentName')}
                placeholder="Full name"
                required
              />
              <FormField
                label="Student name"
                name="studentName"
                value={form.studentName}
                onChange={updateField('studentName')}
                placeholder="Child's full name"
              />
              <FormField
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder="parent@example.com"
                required
              />
              <FormField
                label="Phone number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={updateField('phone')}
                placeholder="+91 98765 43210"
                required
              />
              <FormField
                label="Class applying for"
                name="grade"
                type="select"
                value={form.grade}
                placeholder="-- select class --"
                onChange={updateField('grade')}
                options={[
                  { value: 'nursery-ukg', label: 'Nursery to UKG' },
                  { value: 'class-1-5', label: 'Classes I to V' },
                  { value: 'class-6-10', label: 'Classes VI to X' },
                  { value: 'class-11-12', label: 'Classes XI and XII' },
                ]}
                required
              />
              <FormField
                label="Enquiry about"
                name="enquiryType"
                type="select"
                value={form.enquiryType}
                placeholder="-- Enquiry about--"
                onChange={updateField('enquiryType')}
                options={[
                  { value: 'admission', label: 'Admission process' },
                  { value: 'fees', label: 'Fee structure' },
                  { value: 'transport', label: 'School transport' },
                  { value: 'visit', label: 'Campus visit' },
                  { value: 'other', label: 'Other question' },
                ]}
                required
              />
              <FormField
                label="How can we help?"
                name="message"
                type="textarea"
                value={form.message}
                onChange={updateField('message')}
                placeholder="Share your questions or preferred time for a call."
                rows={6}
                maxLength={800}
                colSpan={2}
                required
              />
            </div>

            <div className="mt-5">
              <FormField
                label="I agree that Demo School may contact me about this enquiry."
                name="consent"
                type="checkbox"
                value={form.consent}
                onCheckboxChange={consent => {
                  setForm(current => ({ ...current, consent }));
                  setError('');
                }}
              />
            </div>

            {error && (
              <p
                className="mt-4 text-sm font-semibold text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}
            {submitted && (
              <div
                className="mt-5 rounded-md border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800"
                role="status"
              >
                Thank you. Your enquiry has been recorded successfully.
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full bg-[#b8751c] font-bold text-white hover:bg-[#975d13]"
            >
              <Send aria-hidden="true" /> Send enquiry
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default EnquiryPage;
