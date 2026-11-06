import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link, Route, Routes } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SchoolHomePage from '@/websites/SchoolHomePage';
import NoticeBoardPage from '@/websites/NoticeBoardPage';
import EnquiryPage from '@/websites/EnquiryPage';
import AboutUsPage from '@/websites/AboutUsPage';

export const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100">
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-blue-700" />
      <h1 className="mt-4 text-3xl font-bold text-gray-950 dark:text-slate-100">
        Page not found
      </h1>
      <p className="mt-3 text-gray-600 dark:text-slate-300">
        This page is not part of the school website.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Go home</Link>
      </Button>
    </section>
  </div>
);

const WebsiteApp: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SchoolHomePage />} />
      <Route path="notice-board" element={<NoticeBoardPage />} />
      <Route path="enquiry" element={<EnquiryPage />} />
      <Route path="about-us" element={<AboutUsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default WebsiteApp;
