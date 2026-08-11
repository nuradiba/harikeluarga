type LoadingScreenProps = {
  label?: string;
};

export function LoadingScreen({ label = "Memuatkan..." }: LoadingScreenProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center font-sans"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-spinner loading-lg" aria-hidden="true" />
        <span className="text-sm opacity-70">{label}</span>
      </div>
    </div>
  );
}
