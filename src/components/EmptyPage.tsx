// src/components/EmptyPage.tsx
export default function EmptyPage({ title }: { title: string }) {
  return (
    <div className="p-20 text-center">
      <h1 className="text-2xl font-bold">{title} Coming Soon</h1>
      <a href="/dashboard" className="text-blue-600 underline">Back to Dashboard</a>
    </div>
  );
}