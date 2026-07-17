"use client";

import { useMemo, useState } from "react";
import type React from "react";

import { PaginationControls } from "@/components/ui/pagination";

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
            <input
              type="text"
              placeholder={search.placeholder ?? "Search..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/40"
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
                      ? "rounded-full bg-[#F86306] px-4 py-2 text-xs font-normal text-white"
                      : "rounded-full border border-white/15 px-4 py-2 text-xs font-light text-white/70 transition-colors hover:bg-white/5 hover:text-white"
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
              {filtered.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="border-b border-white/5 text-white/80 last:border-0"
                >
                  {columns.map((col) => (
                    <td key={col.id} className={col.className ?? "px-6 py-4"}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
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
          />
        )}
      </div>
    </div>
  );
}
