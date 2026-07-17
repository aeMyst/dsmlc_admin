import Link from "next/link";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  basePath,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-6 py-3">
      <Link
        href={`${basePath}?page=${prevPage}`}
        aria-disabled={currentPage === 1}
        className={
          currentPage === 1
            ? "pointer-events-none rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/20"
            : "rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        }
      >
        Previous
      </Link>

      <span className="text-xs font-light text-white/40">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={`${basePath}?page=${nextPage}`}
        aria-disabled={currentPage === totalPages}
        className={
          currentPage === totalPages
            ? "pointer-events-none rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/20"
            : "rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        }
      >
        Next
      </Link>
    </div>
  );
}
