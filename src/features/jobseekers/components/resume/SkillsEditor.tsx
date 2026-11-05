import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import FormField from '@/components/common/FormField';

type SkillsEditorProps = {
  skills: string[];
  onChange: (skills: string[]) => void;
};

const SkillsEditor = ({ skills, onChange }: SkillsEditorProps) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const addSkill = () => {
    const nextSkill = input.trim();
    if (!nextSkill) return;
    if (skills.some(skill => skill.toLowerCase() === nextSkill.toLowerCase())) {
      setError('This skill is already added.');
      return;
    }
    if (skills.length >= 20) {
      setError('You can add up to 20 skills.');
      return;
    }
    onChange([...skills, nextSkill]);
    setInput('');
    setError('');
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSkill();
    }
  };

  return (
    <section className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
            Key skills
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add the skills recruiters should match you with.
          </p>
        </div>
        <span className="rounded-full bg-blue-50 dark:bg-blue-800/40 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
          {skills.length}/20
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map(skill => (
          <span
            key={skill}
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-800/40 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:text-blue-400"
          >
            {skill}
            <button
              type="button"
              aria-label={`Remove ${skill}`}
              className="rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => onChange(skills.filter(item => item !== skill))}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>

      <div className="mt-4">
        <FormField
          label="Add skill"
          name="keySkill"
          type="buttonText"
          value={input}
          onChange={setInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          buttonText="Add"
          buttonVariant="default"
          onButtonClick={addSkill}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </section>
  );
};

export default SkillsEditor;
