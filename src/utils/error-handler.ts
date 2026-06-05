import toast from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, showToast = true): string {
  let message = 'An unexpected error occurred';

  if (error instanceof AppError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  if (showToast) {
    toast.error(message);
  }

  console.error('Error:', error);
  return message;
}

export function handleSuccess(message: string) {
  toast.success(message);
}
