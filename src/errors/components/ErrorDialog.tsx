import { type AppError } from '@/errors/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleXIcon } from 'lucide-react';

const SHOW_ORIGINAL_ERROR = true;

interface Props {
  error?: AppError;
  onDismiss: () => void;
}

export const ErrorDialog = (props: Props) => {
  const { onDismiss, error } = props;

  const isUnexpectedError = error?.code === 'UNEXPECTED_ERROR';

  const message = error && (
    <>
      {!isUnexpectedError && (
        <>
          {error.code.toString()}
          <br />
        </>
      )}
      Event ID: {error.eventId}
    </>
  );

  return (
    <Dialog
      open={Boolean(error)}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onDismiss();
        }
      }}
    >
      <DialogContent>
        <DialogHeader className="pr-0 border-none">
          <DialogTitle className="text-center">{error?.message}</DialogTitle>
          {message && (
            <DialogDescription className="text-center">
              {message}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex justify-center -mb-4 -mt-8">
          <CircleXIcon className="w-10 h-10 text-destructive" />
        </div>
        {SHOW_ORIGINAL_ERROR && error && (
          <div className="text-left overflow-x-auto rounded bg-ipor-dark-1 border border-white/10 p-2">
            <pre>
              <code>{getErrorLog(error.originalError)}</code>
            </pre>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onDismiss}>
            Dismiss
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const getErrorLog = (originalError: unknown) => {
  const originalErrorMsg =
    originalError instanceof Error
      ? originalError.message
      : JSON.stringify(originalError);

  return originalErrorMsg;
};
