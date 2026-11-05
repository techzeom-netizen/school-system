import { useState } from 'react';
import { Mail } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import WebsiteShell from '@/features/jobseekers/components/WebsiteShell';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  return (
    <WebsiteShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-6 flex items-center gap-3">
          <Mail className="h-6 w-6 text-blue-700 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-950 dark:text-slate-100">
            Contact HR
          </h1>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Name"
              name="name"
              value={name}
              onChange={setName}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
            />
            <FormField
              label="Message"
              name="message"
              type="textarea"
              value={message}
              onChange={setMessage}
              colSpan={2}
            />
          </div>
          <Button className="mt-5">Submit</Button>
        </div>
      </section>
    </WebsiteShell>
  );
};

export default ContactPage;
