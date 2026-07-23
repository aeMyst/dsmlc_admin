"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import type React from "react";

import { PaginationControls } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  id: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  width?: string;
}

interface DataTableSearchConfig<T> {
  placeholder?: string;
  filterFn: (row: T, query: string) => boolean;
}

export interface DataTableFilterConfig<T> {
  id: string;
  label?: string;
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
  filters?: DataTableFilterConfig<T>[];
  pagination?: DataTablePaginationConfig;
}

const ALL = "All";

export function DataTable<T>({
  data,
  columns,
  getRowKey,
  minWidth = "640px",
  emptyMessage = "No results.",
  search,
  filters,
  pagination,
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const shouldReduceMotion = useReducedMotion();

  const filterOptions = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const filter of filters ?? []) {
      result[filter.id] = Array.from(
        new Set(data.map((row) => filter.getValue(row))),
      );
    }
    return result;
  }, [data, filters]);

  const filtered = data
    .filter((row) =>
      (filters ?? []).every((filter) => {
        const selected = activeFilters[filter.id];
        return (
          !selected || selected === ALL || filter.getValue(row) === selected
        );
      }),
    )
    .filter((row) => (search ? search.filterFn(row, query) : true));

  const hasToolbar = Boolean(search || (filters && filters.length > 0));

  return (
    <div className="space-y-4">
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {search && (
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={search.placeholder ?? "Search..."}
            />
          )}

          {filters?.map((filter) => {
            const selected = activeFilters[filter.id] ?? ALL;
            return (
              <div
                key={filter.id}
                className="flex flex-wrap items-center gap-2"
              >
                {filter.label && (
                  <span className="text-xs font-light text-[#8a8a8a]">
                    {filter.label}
                  </span>
                )}
                {[ALL, ...filterOptions[filter.id]].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setActiveFilters((prev) => ({
                        ...prev,
                        [filter.id]: option,
                      }))
                    }
                    className={
                      option === selected
                        ? "accent-gradient min-h-[40px] rounded-full px-4 py-2 text-xs font-medium text-white"
                        : "min-h-[40px] rounded-full border border-[#2a2a2a] px-4 py-2 text-xs font-light text-[#c0c0c0] transition-colors hover:bg-white/5 hover:text-white"
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <div className="overflow-hidden rounded-[14px] border border-[#1e1e1e] bg-[#111111]">
        <div className="overflow-x-auto">
          <table
            className="w-full table-fixed text-left text-sm"
            style={{ minWidth }}
          >
            <colgroup>
              {columns.map((col) => (
                <col
                  key={col.id}
                  style={col.width ? { width: col.width } : undefined}
                />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-[#1e1e1e] text-[#8a8a8a]">
                {columns.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className="truncate px-6 py-3 text-[11.5px] font-medium uppercase tracking-wide"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filtered.map((row) => (
                  <motion.tr
                    key={getRowKey(row)}
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="border-b border-[#191919] text-[#d0d0d0] transition-colors last:border-0 hover:bg-[#161616]"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={cn(
                          "overflow-hidden text-ellipsis whitespace-nowrap px-6 py-4",
                          col.className,
                        )}
                      >
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
                    className="px-6 py-8 text-center text-[#8a8a8a]"
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
