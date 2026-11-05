import { useState } from 'react';
import { CheckCircle2, ClipboardCheck, ExternalLink } from 'lucide-react';
import Section from '@/components/common/Section';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const acknowledgementSteps = [
  {
    title: 'A document is published',
    description: 'HR shares a policy or company document that needs review.',
  },
  {
    title: 'Review the document',
    description: 'Open the document and read the information carefully.',
  },
  {
    title: 'Submit your acknowledgement',
    description: 'Confirm that you have read and understood the document.',
  },
  {
    title: 'Track your status',
    description: 'Your completed acknowledgement is recorded for HR.',
  },
];

const AcknowledgementsTab = () => {
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  const openWorkflow = () => setIsWorkflowOpen(true);

  return (
    <>
      <Section title="Acknowledgements">
        <div className="mb-4 flex justify-end">
          <Button type="button" onClick={openWorkflow}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Acknowledgement
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-success bg-success/10">
            <CheckCircle2 className="h-7 w-7 text-success" aria-hidden="true" />
          </span>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              You&apos;re up to date
            </h3>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              No pending document acknowledgements. View the workflow to see how
              future acknowledgements are handled.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-1"
            onClick={openWorkflow}
          >
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            View acknowledgement
          </Button>
        </div>
      </Section>

      <Dialog open={isWorkflowOpen} onOpenChange={setIsWorkflowOpen}>
        <DialogContent
          className="max-h-[85vh] overflow-y-auto sm:max-w-xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Acknowledgement</DialogTitle>
            <DialogDescription>
              Follow these steps when HR shares a document that needs your
              acknowledgement.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            {acknowledgementSteps.map((step, index) => (
              <Card
                key={step.title}
                className="flex items-start gap-3 p-4 shadow-none"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-semibold text-card-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setIsWorkflowOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AcknowledgementsTab;
