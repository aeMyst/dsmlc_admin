import Link from "next/link";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string>;
}

export function PaginationControls({
  currentPage,
  totalPages,
  basePath,
  extraParams,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  function buildHref(page: number) {
    const params = new URLSearchParams(extraParams);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-between border-t border-[#1e1e1e] px-6 py-3">
      <Link
        href={buildHref(prevPage)}
        aria-disabled={currentPage === 1}
        className={
          currentPage === 1
            ? "pointer-events-none rounded-full border border-[#1e1e1e] px-3 py-1.5 text-xs text-[#4a4a4a]"
            : "rounded-full border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#c0c0c0] transition-colors hover:bg-white/5 hover:text-white"
        }
      >
        Previous
      </Link>

      <span className="text-xs font-light text-[#8a8a8a]">
        Page {currentPage} of {totalPages}
      </span>

      <Link
        href={buildHref(nextPage)}
        aria-disabled={currentPage === totalPages}
        className={
          currentPage === totalPages
            ? "pointer-events-none rounded-full border border-[#1e1e1e] px-3 py-1.5 text-xs text-[#4a4a4a]"
            : "rounded-full border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#c0c0c0] transition-colors hover:bg-white/5 hover:text-white"
        }
      >
        Next
      </Link>
    </div>
  );
}
