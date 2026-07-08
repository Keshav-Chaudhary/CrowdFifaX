export function ChatError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p role="alert" className="px-4 pb-2 text-center text-sm text-[var(--critical)]">
      {error}
    </p>
  );
}
