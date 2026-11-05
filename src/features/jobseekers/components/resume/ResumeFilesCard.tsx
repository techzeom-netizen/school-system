import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import {
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Star,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useScrollThumb from '@/hooks/useScrollThumb';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  acceptedResumeTypes,
  createResumeFromFile,
  formatBytes,
  formatDate,
  MAX_FILE_SIZE,
  MAX_RESUMES,
  type ResumeFile,
} from '../../data/resume';

type ResumeFilesCardProps = {
  resumes: ResumeFile[];
  onChange: (resumes: ResumeFile[]) => void;
  onNotice: (message: string) => void;
  onTouched: () => void;
};

const ResumeFilesCard = ({
  resumes,
  onChange,
  onNotice,
  onTouched,
}: ResumeFilesCardProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [replaceId, setReplaceId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { scrollRef, scrollThumb, updateScrollThumb } =
    useScrollThumb<HTMLDivElement>(previewId);

  const defaultResume = resumes.find(resume => resume.isDefault);
  const resumeToDelete = resumes.find(resume => resume.id === deleteId);
  const previewResume = resumes.find(resume => resume.id === previewId);
  const previewUrl = useMemo(() => {
    if (!previewResume?.file) return '';

    return URL.createObjectURL(previewResume.file);
  }, [previewResume]);
  const canEmbedPreview = previewResume?.file?.type === 'application/pdf';

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openPicker = (targetId?: string) => {
    setReplaceId(targetId || null);
    inputRef.current?.click();
  };

  const setAsDefault = (id: string) => {
    onChange(
      resumes.map(resume => ({ ...resume, isDefault: resume.id === id }))
    );
    onTouched();
    // TODO: Persist default resume selection with resume API.
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (!acceptedResumeTypes.includes(file.type)) {
      setError('Upload a PDF, DOC, or DOCX file.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Resume must be 5 MB or smaller.');
      return;
    }
    if (!replaceId && resumes.length >= MAX_RESUMES) {
      setError('You can keep up to 3 resume versions.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    window.setTimeout(() => {
      const nextResume = createResumeFromFile(file, resumes.length === 0);
      const nextResumes = replaceId
        ? resumes.map(resume =>
            resume.id === replaceId
              ? { ...nextResume, id: resume.id, isDefault: resume.isDefault }
              : resume
          )
        : [nextResume, ...resumes];

      onChange(nextResumes);
      onTouched();
      setUploading(false);
      setReplaceId(null);
      setSuccess(
        replaceId
          ? `${file.name} replaced successfully.`
          : `${file.name} uploaded.`
      );
      // TODO: Upload or replace resume file through resume API.
    }, 900);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const remaining = resumes.filter(resume => resume.id !== deleteId);
    const deletedDefault = resumes.find(
      resume => resume.id === deleteId
    )?.isDefault;
    const nextResumes =
      deletedDefault && remaining[0]
        ? remaining.map((resume, index) => ({
            ...resume,
            isDefault: index === 0,
          }))
        : remaining;

    onChange(nextResumes);
    onTouched();
    setDeleteId(null);
    // TODO: Delete resume file through resume API.
  };

  const handleZoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPicker();
    }
  };

  return (
    <section
      id="resume-files"
      className="rounded-t-md border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 p-4 shadow-sm"
    >
      <div className="flex flex-col gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-slate-100">
            Your resumes
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Keep up to 3 versions and pick a default for applying.
          </p>
        </div>
        <span className="w-fit rounded-full bg-blue-50 dark:bg-blue-800/60 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
          {resumes.length}/{MAX_RESUMES}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {resumes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No resumes uploaded yet.
          </div>
        ) : (
          resumes.map(resume => (
            <div
              key={resume.id}
              className="rounded-lg border border-slate-100 dark:border-white/20 bg-slate-50 dark:bg-slate-800  p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 gap-3">
                  <FileText className="mt-1 h-5 w-5 shrink-0 text-blue-700 dark:text-blue-400" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-bold text-slate-950 dark:text-slate-100">
                        {resume.name}
                      </p>
                      <span className="rounded-full bg-white dark:bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        {resume.label}
                      </span>
                      {resume.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <Star className="h-3 w-3 fill-emerald-500" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatBytes(resume.size)} | Last updated{' '}
                      {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {!resume.isDefault && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAsDefault(resume.id)}
                    >
                      Set as default
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${resume.name}`}
                    onClick={() => setPreviewId(resume.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Download ${resume.name}`}
                    onClick={() =>
                      onNotice(
                        `Connect your download API to download ${resume.name}`
                      )
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Replace ${resume.name}`}
                    onClick={() => openPicker(resume.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${resume.name}`}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-400"
                    onClick={() => setDeleteId(resume.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={event => {
          handleFiles(event.target.files);
          event.target.value = '';
        }}
      />
      <div
        role="button"
        tabIndex={0}
        onKeyDown={handleZoneKeyDown}
        onClick={() => openPicker()}
        onDragOver={event => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={event => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        className={`mt-4 rounded-lg border border-dashed p-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          dragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40'
            : 'border-blue-300 dark:border-blue-700 bg-blue-50/40 dark:bg-blue-950/40'
        }`}
      >
        <UploadCloud className="mx-auto h-8 w-8 text-blue-700 dark:text-blue-400" />
        <p className="mt-2 font-semibold text-slate-950 dark:text-slate-100">
          Drag and drop your resume here, or click to choose a file
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          PDF, DOC or DOCX | up to 5 MB
        </p>
        <Button
          type="button"
          className="mt-3 rounded-none bg-blue-600 text-white hover:bg-blue-700"
          onClick={event => {
            event.stopPropagation();
            openPicker();
          }}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud className="h-4 w-4" />
          )}
          Choose file
        </Button>
      </div>
      <div aria-live="polite">
        {error && (
          <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </p>
        )}
      </div>

      <Dialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this resume?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {resumeToDelete?.name} will be removed from your resume history.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(previewId)} onOpenChange={() => setPreviewId(null)}>
        <DialogContent className="flex h-screen max-h-screen w-screen max-w-none flex-col rounded-none p-0 sm:max-w-none">
          <DialogHeader className="shrink-0 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
            <DialogTitle>Resume preview</DialogTitle>
          </DialogHeader>

          <div className="relative min-h-0 flex-1">
            <div
              ref={scrollRef}
              onScroll={updateScrollThumb}
              className="profile-sidebar-scroll h-[calc(100vh-73px)] overflow-y-auto px-6 py-5 pr-8"
            >
              {previewResume && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950 dark:text-slate-100">
                        {previewResume.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatBytes(previewResume.size)} | Last updated{' '}
                        {formatDate(previewResume.updatedAt)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-none border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      onClick={() =>
                        onNotice(
                          `Connect your download API to download ${previewResume.name}`
                        )
                      }
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>

                  {previewUrl && canEmbedPreview ? (
                    <iframe
                      title={`Preview ${previewResume.name}`}
                      src={previewUrl}
                      className="h-[calc(100vh-170px)] min-h-[640px] w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  ) : previewUrl ? (
                    <div className="flex min-h-[640px] items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6">
                      <div className="max-w-md text-center">
                        <FileText className="mx-auto h-12 w-12 text-blue-700 dark:text-blue-400" />
                        <h3 className="mt-4 text-lg font-bold text-slate-950 dark:text-slate-100">
                          {previewResume.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          This file is uploaded and ready. DOC and DOCX files
                          cannot be rendered directly in the browser preview, so
                          download it to view the exact document.
                        </p>
                        <Button
                          type="button"
                          className="mt-4 rounded-none bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() =>
                            onNotice(
                              `Connect your download API to download ${previewResume.name}`
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                          Download resume
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-4">
                      <div className="mx-auto min-h-[calc(100vh-160px)] max-w-[820px] rounded-md bg-white dark:bg-slate-900 p-8 shadow-sm">
                        <div className="border-b border-slate-200 dark:border-slate-700 pb-5">
                          <h3 className="text-3xl font-bold text-slate-950 dark:text-slate-100">
                            Aarav Verma
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-blue-700 dark:text-blue-400">
                            Frontend Engineer
                          </p>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Bengaluru, India | aarav.verma@email.com |
                            linkedin.com/in/aarav-verma
                          </p>
                        </div>

                        <div className="mt-6 space-y-6 text-sm text-slate-700 dark:text-slate-200">
                          <section>
                            <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                              Summary
                            </h4>
                            <p className="mt-2 leading-6">
                              Frontend engineer with 3+ years of experience
                              building responsive hiring dashboards, reusable
                              React components, and candidate-facing job
                              discovery workflows.
                            </p>
                          </section>

                          <section>
                            <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                              Skills
                            </h4>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {[
                                'React',
                                'TypeScript',
                                'Tailwind CSS',
                                'REST APIs',
                                'JavaScript',
                                'UI Components',
                              ].map(skill => (
                                <span
                                  key={skill}
                                  className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </section>

                          <section>
                            <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                              Experience
                            </h4>
                            <div className="mt-2">
                              <p className="font-semibold text-slate-950 dark:text-slate-100">
                                Teacher, Demo School
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Apr 2023 - Present
                              </p>
                              <ul className="mt-2 list-disc space-y-1 pl-4 leading-6">
                                <li>
                                  Built candidate job search, saved jobs, and
                                  resume management screens with reusable React
                                  components.
                                </li>
                                <li>
                                  Improved user workflows through responsive
                                  layouts, clearer filtering, and state
                                  feedback.
                                </li>
                              </ul>
                            </div>
                          </section>

                          <section>
                            <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                              Education
                            </h4>
                            <p className="mt-2 font-semibold text-slate-950 dark:text-slate-100">
                              B.Tech Computer Science
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Bengaluru Institute of Technology | 2019 - 2023
                            </p>
                          </section>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {scrollThumb.visible && (
              <div className="pointer-events-none absolute bottom-0 right-2 top-0 w-2">
                <div
                  className="absolute right-0 w-[3px] rounded-full bg-blue-600"
                  style={{
                    height: `${scrollThumb.height}px`,
                    top: `${scrollThumb.top}px`,
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {defaultResume && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Current default resume: {defaultResume.name}
        </p>
      )}
    </section>
  );
};

export default ResumeFilesCard;
