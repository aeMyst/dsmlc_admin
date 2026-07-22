"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import type React from "react";

import { PaginationControls } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableSearchConfig<T> {
  placeholder?: string;
  filterFn: (row: T, query: string) => boolean;
}

interface DataTableCategoryFilterConfig<T> {
  getValue: (row: T) => string;
}

interface DataTablePaginationConfig {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string>;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string;
  minWidth?: string;
  emptyMessage?: string;
  search?: DataTableSearchConfig<T>;
  categoryFilter?: DataTableCategoryFilterConfig<T>;
  pagination?: DataTablePaginationConfig;
}

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  minWidth = "640px",
  emptyMessage = "No results.",
  search,
  categoryFilter,
  pagination,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const shouldReduceMotion = useReducedMotion();

  const categories = useMemo(() => {
    if (!categoryFilter) return [];
    return [
      "All",
      ...Array.from(new Set(data.map((row) => categoryFilter.getValue(row)))),
    ];
  }, [data, categoryFilter]);

  const filtered = data
    .filter((row) =>
      categoryFilter && category !== "All"
        ? categoryFilter.getValue(row) === category
        : true,
    )
    .filter((row) => (search ? search.filterFn(row, query) : true));

  const hasToolbar = Boolean(search || categoryFilter);

  return (
    <div className="space-y-4">
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-3">
          {search && (
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={search.placeholder ?? "Search..."}
            />
          )}

          {categoryFilter && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={
                    cat === category
                      ? "min-h-[40px] rounded-full bg-brand px-4 py-2 text-xs font-normal text-white"
                      : "min-h-[40px] rounded-full border border-white/15 px-4 py-2 text-xs font-light text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" style={{ minWidth }}>
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                {columns.map((col) => (
                  <th key={col.id} scope="col" className="px-6 py-3 font-light">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((row, index) => (
                  <motion.tr
                    key={getRowKey(row)}
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(index, 8) * 0.02,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-white/5 text-white/80 last:border-0"
                  >
                    {columns.map((col) => (
                      <td key={col.id} className={col.className ?? "px-6 py-4"}>
                        {col.render(row)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-white/40"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            basePath={pagination.basePath}
            extraParams={pagination.extraParams}
          />
        )}
      </div>
    </div>
  );
}
