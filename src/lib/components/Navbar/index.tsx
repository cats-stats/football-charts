import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="flex justify-between items-center py-4 px-4 md:px-8 w-screen sticky">
      <div className="text-lg font-medium">
        <Link href="/">{"Football Utility"}</Link>
      </div>
      <nav className="flex gap-x-3 text-sm font-light text-muted-foreground">
        <Link href="/passing">Passing</Link>
      </nav>
    </div>
  );
};
