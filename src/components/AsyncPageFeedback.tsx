import type { ReactNode } from "react";
import { Button } from "./Button";

type ErrorBannerProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorBanner({
  message,
  onRetry,
  retryLabel = "Reîncearcă",
}: ErrorBannerProps) {
  if (!message) return null;
  return (
    <div className="mx-auto mb-6 flex w-full max-w-7xl flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="min-w-0 flex-1 leading-relaxed">{message}</p>
      {onRetry ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 self-start sm:self-center"
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

type EmptyAction = { label: string; onClick: () => void };

type AsyncListStatusProps = {
  isLoading: boolean;
  error: string;
  isEmpty: boolean;
  loadingLabel: string;
  empty: {
    title: string;
    description?: string;
    action?: EmptyAction;
  };
  onRetry?: () => void;
  children: ReactNode;
};

export function AsyncListStatus({
  isLoading,
  error,
  isEmpty,
  loadingLabel,
  empty,
  onRetry,
  children,
}: AsyncListStatusProps) {
  if (isLoading) {
    return (
      <div className="mx-auto mt-8 w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 text-center text-sm text-amber-700 shadow-sm">
        {loadingLabel}
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto mt-8 w-full max-w-lg rounded-2xl border border-red-200 bg-red-50/90 p-6 text-center shadow-sm">
        <p className="text-base font-semibold text-red-900">
          Nu am putut încărca lista
        </p>
        <p className="mt-2 text-sm leading-relaxed text-red-800">{error}</p>
        {onRetry ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={onRetry}
          >
            Reîncearcă
          </Button>
        ) : null}
      </div>
    );
  }
  if (isEmpty) {
    return (
      <div className="mx-auto mt-8 w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 text-center shadow-sm">
        <p className="text-base font-semibold text-amber-800">{empty.title}</p>
        {empty.description ? (
          <p className="mt-1 text-sm text-amber-600">{empty.description}</p>
        ) : null}
        {empty.action ? (
          <Button
            type="button"
            size="sm"
            onClick={empty.action.onClick}
            className="mt-4"
          >
            {empty.action.label}
          </Button>
        ) : null}
      </div>
    );
  }
  return <>{children}</>;
}

type InlineStatusProps = {
  isLoading: boolean;
  error: string;
  loadingLabel?: string;
  onRetry?: () => void;
  children: ReactNode;
};

export function InlineAsyncStatus({
  isLoading,
  error,
  loadingLabel = "Se încarcă…",
  onRetry,
  children,
}: InlineStatusProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-4 text-center">
        <p className="text-sm font-medium text-red-900">Grafic indisponibil</p>
        <p className="mt-1 text-xs leading-relaxed text-red-800">{error}</p>
        {onRetry ? (
          <Button
            type="button"
            variant="secondary"
            size="xs"
            className="mt-3"
            onClick={onRetry}
          >
            Reîncearcă
          </Button>
        ) : null}
      </div>
    );
  }
  if (isLoading) {
    return (
      <p className="mb-2 text-center text-sm text-amber-700">{loadingLabel}</p>
    );
  }
  return <>{children}</>;
}
