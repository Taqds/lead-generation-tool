import Navbar from "@/components/layout/Navbar";

export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950">
      <Navbar />
      <main className="flex-1 container max-w-7xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
