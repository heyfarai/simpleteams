"use client";

import { comparisonRows } from "./data/comparisonFeatures";
import type { ComparisonRow } from "./types";

export function ComparisonTable() {
  const visibleRows = comparisonRows;
  const renderTableCell = (
    value: string | boolean | undefined,
    type: "full" | "two" | "per",
    row: ComparisonRow
  ) => {
    const isHighlighted = row.highlight === type;

    if (row.badges && typeof value === "string") {
      const badgeClass =
        value === "BEST"
          ? "bg-yellow-500 text-black"
          : value === "AVERAGE"
          ? "bg-gray-500 text-white"
          : value === "LOWEST"
          ? "bg-red-500 text-white"
          : "";

      return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${badgeClass}`}>
          {value}
        </span>
      );
    }

    if (typeof value === "boolean") {
      return (
        <span className={value ? "text-green-600" : "text-red-500"}>
          {value ? "✓" : "✗"}
        </span>
      );
    }

    return (
      <span className={isHighlighted ? "text-green-600 font-bold" : ""}>
        {value}
      </span>
    );
  };

  return (
    <div className="mb-36 md:mb-44 mt-24 md:mt-36">
      <h2 className="md:text-3xl text-2xl font-bold text-center mb-12 grotesk">
        Full Package Comparison
      </h2>

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead>
                  <tr className="bg-gray-100">
                    <th
                      scope="col"
                      className="px-6 py-3 text-start text-xs font-medium text-gray-700 uppercase"
                    >
                      Features & Benefits
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-normal font-extrabold text-green-700 uppercase"
                    >
                      Full Season
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-normal font-extrabold text-gray-700 uppercase"
                    >
                      Two Session
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-normal font-extrabold text-gray-700 uppercase"
                    >
                      Pay Per Session
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {visibleRows.map((row, index) => {
                    if (row.type === "header") {
                      return (
                        <tr key={index}>
                          <td
                            className="bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700"
                            colSpan={4}
                          >
                            {row.section}
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={index}>
                        <td className="bg-white px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {row.label}
                        </td>
                        <td className="bg-white px-6 py-4 whitespace-nowrap text-center text-sm">
                          {renderTableCell(row.full, "full", row)}
                        </td>
                        <td className="bg-white px-6 py-4 whitespace-nowrap text-center text-sm">
                          {renderTableCell(row.two, "two", row)}
                        </td>
                        <td className="bg-white px-6 py-4 whitespace-nowrap text-center text-sm">
                          {renderTableCell(row.per, "per", row)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
