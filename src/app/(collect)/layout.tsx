import { Toaster } from "@/lib/components/ui/toaster";

export default function CollectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="px-4 md:px-8">
      {children}
      <Toaster />
    </main>
  );
}
