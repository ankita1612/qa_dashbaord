import { useState } from "react";
import SummaryCard from "./SummaryCard";
import { useNavigate } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
const getFilteredColumns = (columnStats: any) => {
  return Object.entries(columnStats).filter(([_, stats]: any) => {
    const keys = Object.keys(stats);

    return keys.some(
      (key) =>
        ![
          "total_records",
          "valid_records",
          "invalid_records",
          "error_msg",
        ].includes(key) &&
        stats[key] !== 0 &&
        stats[key] !== null,
    );
  });
};
const ValidationResult = ({ responseData, onUploadNew }: any) => {
  const navigate = useNavigate();
  const [expandedColumn, setExpandedColumn] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState<any>(null);

  if (!responseData) return null;

  const { total_rows, valid_rows, invalid_rows, column_wise_stats } =
    responseData.data;
  const { result_file, errors_for_coloms } = responseData;

  const filteredColumns = getFilteredColumns(column_wise_stats);

  return (
    <div className="mt-6 space-y-6">
      <div className="mt-6 text-right">
        <button
          onClick={onUploadNew}
          className="flex items-center gap-2 bg-black border border-gray-300 text-white py-2.5 px-5 rounded-xl font-medium hover:bg-gray-700 hover:shadow-sm transition-all duration-200"
        >
          <FaUpload className="text-sm" />
          Upload Another File
        </button>
      </div>
      {/* 🔹 TOP SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard title="Total Rows" value={total_rows} />
        <SummaryCard title="Valid Rows" value={valid_rows} success />
        <SummaryCard title="Invalid Rows" value={invalid_rows} error />
      </div>
      <div className="flex justify-end">
        <a
          href={result_file}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 rounded-xl "
        >
          Download Report
        </a>
      </div>
      {/* 🔹 COLUMN LIST */}
      <div className="bg-white border shadow-sm rounded-xl">
        <div className="p-4 font-semibold text-gray-700 border-b">
          Column Result
        </div>

        <div className="divide-y">
          {filteredColumns.map(([col, stats]: any) => {
            const issues = Object.entries(stats).filter(
              ([key, val]) =>
                ![
                  "total_records",
                  "valid_records",
                  "invalid_records",
                  "error_msg",
                ].includes(key) &&
                val !== 0 &&
                val !== null,
            );

            return (
              <div key={col} className="border-b">
                <div className="px-4 py-3 transition hover:bg-gray-50">
                  <div className="flex items-center justify-between gap-4">
                    {/* LEFT → Column + Issues in ONE ROW */}
                    <div className="flex items-center flex-1 gap-3 overflow-hidden">
                      {/* Column Name */}
                      <div className="font-medium text-gray-800 whitespace-nowrap">
                        {col}
                      </div>

                      {/* Issues */}
                      <div className="flex flex-wrap gap-2">
                        {issues.length > 0 ? (
                          issues.map(([key, val]) => (
                            <span
                              key={key}
                              className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-full whitespace-nowrap"
                            >
                              {key.replaceAll("_", " ")} ({val})
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            No issues
                          </span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT → Button */}
                    <div className="flex items-center shrink-0">
                      <button
                        onClick={() =>
                          setExpandedColumn(expandedColumn === col ? null : col)
                        }
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 transition bg-blue-50 rounded-lg hover:bg-blue-100"
                      >
                        {expandedColumn === col
                          ? "Hide details"
                          : "View details"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXPAND SECTION */}
                {expandedColumn === col && (
                  <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">
                    <span className="font-semibold text-gray-700">
                      Invalid Types:
                    </span>{" "}
                    {errors_for_coloms[col]?.length > 0
                      ? errors_for_coloms[col].join(", ")
                      : "No errors"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔹 MODAL */}
      {selectedColumn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white w-[400px] rounded-xl shadow-lg p-5">
            <h2 className="mb-3 text-lg font-semibold">
              {selectedColumn.name} Details
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              {Object.entries(selectedColumn.stats).map(([key, val]: any) => {
                if (
                  [
                    "total_records",
                    "valid_records",
                    "invalid_records",
                  ].includes(key)
                )
                  return null;

                if (!val) return null;

                return (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">
                      {key.replaceAll("_", " ")}
                    </span>
                    <span className="font-medium">{val}</span>
                  </div>
                );
              })}
            </div>

            {/* Error Messages */}
            {selectedColumn.stats.error_msg?.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium">Errors:</p>
                <ul className="pl-5 space-y-1 text-sm text-red-600 list-disc">
                  {selectedColumn.stats.error_msg.map(
                    (err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ),
                  )}
                </ul>
              </div>
            )}

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setSelectedColumn(null)}
                className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ValidationResult;
