interface AdminPlaceholderProps {
  title: string;
  phase?: string;
}

export function AdminPlaceholder({ title, phase = "Phase 2" }: AdminPlaceholderProps) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
      <p className="font-medium text-gray-700">{title}</p>
      <p className="mt-2">Module sẽ được triển khai trong {phase}.</p>
    </div>
  );
}
