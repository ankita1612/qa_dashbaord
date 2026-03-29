import { FiTrash2, FiEdit } from "react-icons/fi";
import React, { useState } from "react";
import TagInputRule from "./TagInputRule";
import toast from "react-hot-toast";
import SubDependencySection from "./SubDependencySection";
const date_format_options = [
  "YYYY-MM-DD",
  "DD-MM-YYYY",
  "MM-DD-YYYY",
  "YYYY/MM/DD",
  "DD/MM/YYYY",
  "MM/DD/YYYY",
  "YYYY-MM-DD HH:mm:ss",
  "DD-MM-YYYY HH:mm:ss",
  "MM/DD/YYYY HH:mm:ss",
  "YYYY-MM-DDTHH:mm:ss",
  "DD-MM-YYYY h:i:s a",
  "MM/DD/YYYY h:i a",
  "YYYY-MM-DD h:i:s A",
  "DD MMM YYYY",
  "MMM DD, YYYY",
  "MMMM DD, YYYY",
  "DD Month YYYY",
  "DD-MM-YY",
  "MM/DD/YY",
  "DD_MM_YYYY",
  "MM_DD_YYYY",
  "YYYY_MM_DD",
  "DD_MM_YYYY h:i:s a",
  "MM_DD_YYYY h:i:s a",
  "YYYY_MM_DD h:i:s a",
  "DD_MM_YYYY HH:mm:ss",
  "MM_DD_YYYY HH:mm:ss",
  "YYYY_MM_DD HH:mm:ss",
];

type Rule = {
  type: string;
  value?: string | number;
};

type HeaderItem = {
  id: number;
  name: string;
  rules: Rule[];
};

type Props = {
  headers: string[];
  onRulesChange?: (data: any) => void;
};

const ShowValidationRules: React.FC<Props> = ({ headers, onRulesChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [tempRule, setTempRule] = useState<{
    type?:
      | "required"
      | "data_type"
      | "data_length"
      | "date_format"
      | "data_redundant"
      | "regex"
      | "fixed_headers"
      | "not_match_found"
      | "cell_end_with"
      | "cell_start_with"
      | "dependency";

    required?: boolean;
    data_type?: string;
    length_mode?: "variable" | "fixed";
    min?: any;
    max?: any;
    fixed?: any;
    date_format?: string;
    data_redundant_value?: string;
    data_redundant_threshold?: string;
    cell_contains_value?: string;

    fixed_headers?: string[];
    not_match_found?: string[];
    cell_end_with?: string[];
    cell_start_with?: string[];

    // ✅ DEPENDENCY
    dependency_mode?: "required" | "other";
    other_value_main_dependency?: string;

    // ✅ TEMP INPUT
    sub_headers?: string[];
    sub_mode?: "required" | "other";
    sub_value?: string;

    // ✅ FINAL LIST
    sub_dependencies?: {
      headers: string[];
      mode: "required" | "other";
      value?: string;
    }[];
  }>({
    // ✅ VERY IMPORTANT DEFAULTS (fix uncontrolled warning)
    dependency_mode: "required",
    sub_headers: [],
    sub_mode: "required",
    sub_dependencies: [],
  });
  const [data, setData] = useState<HeaderItem[]>(
    headers.map((h, i) => ({
      id: i, // ✅ ADD THIS
      name: h,
      rules: [],
    })),
  );
  const [search, setSearch] = useState("");
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const [selectedHeader, setSelectedHeader] = useState<number>(0);

  const current = data[selectedHeader];

  const applyRule = () => {
    // ✅ 1. Rule must be selected
    if (!tempRule.type) {
      toast.error("Please select a rule");
      return;
    }

    // ✅ 2. If Data Type → must select value
    if (tempRule.type === "data_type" && !tempRule.data_type) {
      toast.error("Please select data type");
      return;
    }
    if (tempRule.type === "data_length") {
      if (tempRule.length_mode === "fixed" && !tempRule.fixed) {
        toast.error("Please enter fixed length");
        return;
      }

      if (
        tempRule.length_mode !== "fixed" &&
        (!tempRule.min || !tempRule.max)
      ) {
        toast.error("Please enter min and max values");
        return;
      }
    }

    // DATE FORMAT VALIDATION
    if (tempRule.type === "date_format" && !tempRule.date_format) {
      toast.error("Please select date format");
      return;
    }

    if (tempRule.type === "data_redundant") {
      if (!tempRule.data_redundant_value) {
        toast.error("Please enter redundant value");
        return;
      }

      if (!tempRule.data_redundant_threshold) {
        toast.error("Please enter threshold");
        return;
      }
    }

    if (tempRule.type === "data_redundant") {
      if (!tempRule.data_redundant_value) {
        toast.error("Please enter redundant value");
        return;
      }

      if (!tempRule.data_redundant_threshold) {
        toast.error("Please enter threshold");
        return;
      }
    }

    // ✅ Regex Validation
    if (tempRule.type === "regex") {
      if (!tempRule.cell_contains_value) {
        toast.error("Please enter regex value");
        return;
      }
    }

    if (tempRule.type === "fixed_headers") {
      if (!tempRule.fixed_headers || tempRule.fixed_headers.length === 0) {
        toast.error("Please add at least one fixed header");
        return;
      }
    }
    if (tempRule.type === "cell_end_with") {
      if (!tempRule.cell_end_with || tempRule.cell_end_with.length === 0) {
        toast.error("Please add at least one cell_end_with");
        return;
      }
    }
    if (tempRule.type === "cell_start_with") {
      if (!tempRule.cell_start_with || tempRule.cell_start_with.length === 0) {
        toast.error("Please add at least one cell_start_with");
        return;
      }
    }
    if (tempRule.type === "not_match_found") {
      if (!tempRule.not_match_found || tempRule.not_match_found.length === 0) {
        toast.error("Please add at least one not_match_found");
        return;
      }
    }
    if (tempRule.type === "dependency") {
      if (
        tempRule.dependency_mode === "other" &&
        !tempRule.other_value_main_dependency
      ) {
        toast.error("Enter main dependency value");
        return;
      }

      if (
        !tempRule.sub_dependencies ||
        tempRule.sub_dependencies.length === 0
      ) {
        toast.error("Add at least one sub dependency");
        return;
      }
    }
    const updated = [...data];
    const currentHeader = updated[selectedHeader];

    // ✅ If editing → remove OLD rule (regardless of type)
    if (editingIndex !== null) {
      currentHeader.rules.splice(editingIndex, 1);
    }

    // ======================
    // REQUIRED
    // ======================
    if (tempRule.type === "required") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "required",
      //   );

      currentHeader.rules.push({
        type: "required",
        value: tempRule.required ?? true,
      });
    }

    // ======================
    // DATA TYPE
    // ======================
    if (tempRule.type === "data_type") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "data_type",
      //   );

      currentHeader.rules.push({
        type: "data_type",
        value: tempRule.data_type || "string", // ✅ fallback
      });
    }
    if (tempRule.type === "data_length") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "data_length",
      //   );

      currentHeader.rules.push({
        type: "data_length",
        value: {
          mode: tempRule.length_mode || "variable",
          min: tempRule.min,
          max: tempRule.max,
          fixed: tempRule.fixed,
        },
      });
    }

    if (tempRule.type === "date_format") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "date_format",
      //   );

      currentHeader.rules.push({
        type: "date_format",
        value: tempRule.date_format || "YYYY-MM-DD", // ✅ safety fallback
      });
    }

    if (tempRule.type === "data_redundant") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "data_redundant",
      //   );

      currentHeader.rules.push({
        type: "data_redundant",
        value: {
          data_redundant_value: tempRule.data_redundant_value,
          data_redundant_threshold: tempRule.data_redundant_threshold,
        },
      });
    }

    // ======================
    // REGEX
    // ======================
    if (tempRule.type === "regex") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "regex",
      //   );

      currentHeader.rules.push({
        type: "regex",
        value: tempRule.cell_contains_value,
      });
    }

    if (tempRule.type === "fixed_headers") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "fixed_headers",
      //   );

      currentHeader.rules.push({
        type: "fixed_headers",
        value: tempRule.fixed_headers,
      });
    }

    if (tempRule.type === "cell_start_with") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "cell_start_with",
      //   );

      currentHeader.rules.push({
        type: "cell_start_with",
        value: tempRule.cell_start_with,
      });
    }

    if (tempRule.type === "cell_end_with") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "cell_end_with",
      //   );

      currentHeader.rules.push({
        type: "cell_end_with",
        value: tempRule.cell_end_with,
      });
    }

    if (tempRule.type === "not_match_found") {
      //   currentHeader.rules = currentHeader.rules.filter(
      //     (r) => r.type !== "not_match_found",
      //   );

      currentHeader.rules.push({
        type: "not_match_found",
        value: tempRule.not_match_found,
      });
    }
    alert(tempRule.type);
    if (tempRule.type === "dependency") {
      currentHeader.rules.push({
        type: "dependency",
        value: {
          mode: tempRule.dependency_mode,
          main_value:
            tempRule.dependency_mode === "other"
              ? tempRule.other_value_main_dependency
              : null,
          sub_dependencies: tempRule.sub_dependencies,
        },
      });
    }
    setData(updated);
    onRulesChange?.(generateJSON());

    setIsModalOpen(false);
    setTempRule({});
    setEditingIndex(null);
    setEditingRule(false);
    const rule = getRuleName(tempRule.type);
    toast.success(`${rule} rule applied`);
  };

  const generateJSON = () => {
    const result: any = {};

    data.forEach((item) => {
      const obj: any = {};

      item.rules.forEach((rule) => {
        if (rule.type === "required") {
          obj.has_empty = rule.value;
        }

        if (rule.type === "data_type") {
          obj.data_type = rule.value;
        }
        if (rule.type === "data_length") {
          obj.data_length = rule.value;
        }

        if (rule.type === "date_format") {
          obj.date_format = rule.value;
        }
        if (rule.type === "data_redundant") {
          obj.data_redundant_value = rule.value.data_redundant_value;
          obj.data_redundant_threshold = rule.value.data_redundant_threshold;
        }
        if (rule.type === "regex") {
          obj.cell_contains_value = rule.value;
        }
        if (rule.type === "fixed_headers") {
          obj.fixed_headers = rule.value;
        }
        if (rule.type === "cell_start_with") {
          obj.cell_start_with = rule.value;
        }
        if (rule.type === "cell_end_with") {
          obj.cell_end_with = rule.value;
        }
        if (rule.type === "not_match_found") {
          obj.not_match_found = rule.value;
        }
        if (rule.type === "dependency") {
          obj.dependency = {
            mode: rule?.value?.mode,
            main_value: rule?.value?.main_value,
            sub_dependencies: rule?.value?.sub_dependencies,
          };
        }
      });

      if (Object.keys(obj).length > 0) {
        result[item.name] = obj;
      }
    });
    console.log(result);
    return result;
  };
  const handleDeleteRule = (index: number) => {
    if (window.confirm("Are you sure to delete this rule?")) {
      const updated = [...data];
      const currentHeader = updated[selectedHeader];

      const deletedRule = currentHeader.rules[index];

      currentHeader.rules.splice(index, 1);

      setData(updated);

      // ✅ send updated JSON to parent
      onRulesChange?.(generateJSON());

      // ✅ toast message
      const rule = getRuleName(deletedRule.type);
      toast.success(`${rule} rule removed`);
    }
  };

  const getRuleName = (ruleType: string) => {
    if (ruleType === "required") return "Required";
    if (ruleType === "data_type") return "Data Type";
    if (ruleType === "data_length") return "Length type";
    if (ruleType === "regex") return "Regex";
    if (ruleType === "data_redundant") return "Data redundant and threshold";
    if (ruleType === "date_format") return "Date format";
    if (ruleType === "fixed_headers") return "Fixed Header";
    if (ruleType === "cell_start_with") return "Cell start with";
    if (ruleType === "cell_end_with") return "Cell end with";
    if (ruleType === "not_match_found") return "Blocked value";
    if (ruleType === "dependency") return "Dependacy";

    alert(ruleType);
  };
  const appliedRuleTypes = current.rules.map((r) => r.type);
  const appliedRuleDataType = current.rules.filter(
    (r) => r.type == "data_type",
  );

  const currentDataType =
    (appliedRuleDataType?.[0]?.value as string) || "string";

  return (
    <div className="flex h-[600px] border rounded-2xl overflow-hidden bg-white shadow">
      {/* LEFT PANEL */}
      <div className="w-1/3 border-r bg-gray-50 flex flex-col">
        {/* HEADER */}
        <div className="p-4 font-semibold text-gray-700 border-b">Headers</div>

        {/* SEARCH INPUT */}
        <div className="p-3 border-b bg-white">
          <input
            type="text"
            placeholder="Search headers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* LIST */}
        <div className="overflow-y-auto flex-1">
          {filteredData.length === 0 ? (
            <div className="p-4 text-sm text-gray-400 text-center">
              No headers found
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedHeader(item.id)}
                className={`px-4 py-3 cursor-pointer border-b text-sm flex justify-between items-center
      ${
        selectedHeader === item.id
          ? "bg-blue-50 text-blue-600 font-medium"
          : "hover:bg-gray-100"
      }`}
              >
                <span className="truncate">{item.name}</span>

                {item.rules.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {item.rules.length}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 relative flex flex-col">
        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">{current.name}</h2>

          <button
            onClick={() => {
              setEditingRule(false);
              setTempRule({});
              setIsModalOpen(true);
            }}
          >
            Add Rule
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* EMPTY STATE */}
          [[[{JSON.stringify(current.rules)}]]]
          {current.rules.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p className="mb-4">No rules applied</p>

              <button
                onClick={() => {
                  setEditingRule(false);
                  setTempRule({});
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700"
              >
                Add Rule
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {current.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border rounded-lg px-4 py-3 bg-gray-50"
                >
                  <div className="text-sm text-gray-700">
                    {rule.type === "required" && (
                      <span>
                        Required:{" "}
                        <b>{rule.value ? "No Empty Allowed" : "Allow Empty"}</b>
                      </span>
                    )}

                    {rule.type === "data_type" && (
                      <span>
                        Data Type: <b>{rule.value}</b>
                      </span>
                    )}
                    {rule.type === "data_length" && (
                      <span>
                        Length:{" "}
                        <b>
                          {(rule.value as any).mode === "fixed"
                            ? `Fixed (${(rule.value as any).fixed})`
                            : `Min ${(rule.value as any).min} - Max ${(rule.value as any).max}`}
                        </b>
                      </span>
                    )}

                    {/* ✅ DATE FORMAT */}
                    {rule.type === "date_format" && (
                      <span>
                        Date Format: <b>{rule.value as string}</b>
                      </span>
                    )}

                    {rule.type === "data_redundant" && (
                      <span>
                        Redundant:{" "}
                        <b>
                          {rule.value.value} (Threshold: {rule.value.threshold})
                        </b>
                      </span>
                    )}

                    {rule.type === "regex" && (
                      <span>
                        Regex: <b>{rule.value}</b>
                      </span>
                    )}

                    {rule.type === "fixed_headers" && (
                      <span>
                        Fixed Headers:{" "}
                        <b>{(rule.value as string[]).join(", ")}</b>
                      </span>
                    )}
                    {rule.type === "cell_start_with" && (
                      <span>
                        Cell Start With:{" "}
                        <b>{(rule.value as string[]).join(", ")}</b>
                      </span>
                    )}
                    {rule.type === "cell_end_with" && (
                      <span>
                        Cell End With:{" "}
                        <b>{(rule.value as string[]).join(", ")}</b>
                      </span>
                    )}
                    {rule.type === "not_match_found" && (
                      <span>
                        Blocked value:{" "}
                        <b>{(rule.value as string[]).join(", ")}</b>
                      </span>
                    )}
                    {rule.type === "dependency" && (
                      <div>
                        Dependency:
                        <b>
                          {rule.value.mode === "required"
                            ? " Required"
                            : ` ${rule.value.main_value}`}
                        </b>
                        <div className="text-xs text-gray-500 mt-1">
                          {rule.value.sub_dependencies.map(
                            (s: any, i: number) => (
                              <div key={i}>
                                {s.headers.join(", ")} → {s.mode}
                                {s.value && ` (${s.value})`}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditingRule(true);
                        setEditingIndex(idx);
                        if (rule.type === "required") {
                          setTempRule({
                            type: "required",
                            required: rule.value as boolean,
                          });
                        }

                        if (rule.type === "data_type") {
                          setTempRule({
                            type: "data_type",
                            data_type: rule.value as string,
                          });
                        }
                        // ✅ DATA LENGTH
                        if (rule.type === "data_length") {
                          const val = rule.value as any;

                          setTempRule({
                            type: "data_length",
                            length_mode: val.mode || "variable",
                            min: val.min ?? "",
                            max: val.max ?? "",
                            fixed: val.fixed ?? "",
                          });
                        }

                        // ✅ DATE FORMAT
                        if (rule.type === "date_format") {
                          setTempRule({
                            type: "date_format",
                            date_format: rule.value as string,
                          });
                        }

                        // ✅ DATA REDUNDANT
                        if (rule.type === "data_redundant") {
                          const val = rule.value as any;

                          setTempRule({
                            type: "data_redundant",
                            data_redundant_value: val.value,
                            data_redundant_threshold: val.threshold,
                          });
                        }

                        // ✅ REGEX
                        if (rule.type === "regex") {
                          setTempRule({
                            type: "regex",
                            cell_contains_value: rule.value as string,
                          });
                        }

                        if (rule.type === "fixed_headers") {
                          setTempRule({
                            type: "fixed_headers",
                            fixed_headers: rule.value as string[],
                          });
                        }
                        if (rule.type === "cell_start_with") {
                          setTempRule({
                            type: "cell_start_with",
                            cell_start_with: rule.value as string[],
                          });
                        }
                        if (rule.type === "cell_end_with") {
                          setTempRule({
                            type: "cell_end_with",
                            cell_end_with: rule.value as string[],
                          });
                        }
                        if (rule.type === "not_match_found") {
                          setTempRule({
                            type: "not_match_found",
                            not_match_found: rule.value as string[],
                          });
                        }
                        if (rule.type === "dependency") {
                          const val = rule.value as any;

                          setTempRule({
                            type: "dependency", // ✅ VERY IMPORTANT (fix dropdown issue)

                            // MAIN
                            dependency_mode: val.mode || "required",
                            other_value_main_dependency: val.main_value || "",

                            // SUB DEPENDENCIES (existing list)
                            sub_dependencies: val.sub_dependencies || [],

                            // RESET INPUT STATE
                            sub_headers: [],
                            sub_mode: "required",
                            sub_value: "",
                          });
                        }
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 text-sm"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6">
            {/* HEADER */}
            <h2 className="text-lg font-semibold mb-4">
              {editingRule ? "Edit Rule" : "Add Rule"}
            </h2>
            {/* RULE TYPE */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">
                Select Rule
              </label>
              <select
                value={tempRule.type || ""}
                onChange={(e) => {
                  const type = e.target.value as any;

                  setTempRule({
                    type,
                    ...(type === "data_type" && { data_type: "string" }),
                    ...(type === "data_length" && {
                      data_type: "string",
                      length_mode: "variable",
                    }),
                    ...(type === "date_format" && {
                      date_format: "YYYY-MM-DD",
                    }),
                    ...(type === "dependency" && {
                      dependency_mode: "required",
                      sub_headers: [],
                      sub_mode: "required",
                      sub_dependencies: [],
                    }),
                  });
                }}
                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select</option>

                <option
                  value="required"
                  disabled={appliedRuleTypes.includes("required")}
                >
                  Required
                </option>

                <option
                  value="data_type"
                  disabled={appliedRuleTypes.includes("data_type")}
                >
                  Data Type
                </option>

                <option
                  value="data_length"
                  disabled={appliedRuleTypes.includes("data_length")}
                >
                  Data Length
                </option>

                {currentDataType === "date" && (
                  <option
                    value="date_format"
                    disabled={appliedRuleTypes.includes("date_format")}
                  >
                    Date Format
                  </option>
                )}
                <option
                  value="data_redundant"
                  disabled={appliedRuleTypes.includes("data_redundant")}
                >
                  Data Redundant & Threshold
                </option>
                <option
                  disabled={appliedRuleTypes.includes("regex")}
                  value="regex"
                >
                  Regex
                </option>
                <option
                  value="fixed_headers"
                  disabled={appliedRuleTypes.includes("fixed_headers")}
                >
                  Fixed Headers
                </option>
                <option
                  value="cell_start_with"
                  disabled={appliedRuleTypes.includes("cell_start_with")}
                >
                  Cell Start With
                </option>
                <option
                  value="cell_end_with"
                  disabled={appliedRuleTypes.includes("cell_end_with")}
                >
                  Cell End With
                </option>
                <option
                  value="not_match_found"
                  disabled={appliedRuleTypes.includes("not_match_found")}
                >
                  Blocked Value
                </option>
                <option
                  value="dependency"
                  disabled={appliedRuleTypes.includes("dependency")}
                >
                  Dependency
                </option>
              </select>
            </div>
            {/* REQUIRED RULE */}
            {tempRule.type === "required" && (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Allow Empty?</span>

                <input
                  type="checkbox"
                  checked={tempRule.required ?? true}
                  onChange={(e) =>
                    setTempRule({
                      ...tempRule,
                      required: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
              </div>
            )}
            {/* DATA TYPE RULE */}
            {tempRule.type === "data_type" && (
              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Select Data Type
                </label>
                <select
                  value={tempRule.data_type || "string"}
                  onChange={(e) =>
                    setTempRule({
                      ...tempRule,
                      data_type: e.target.value,
                    })
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="string">String</option>
                  <option value="alphabetic">Alphabetic</option>
                  <option value="integer">Integer</option>
                  <option value="float">Float</option>
                  <option value="boolean">Boolean</option>
                  <option value="date">Date</option>
                  <option value="email">Email</option>
                </select>
              </div>
            )}

            {tempRule.type === "data_length" && (
              <div className="space-y-4">
                {/* MODE */}
                <div>
                  <label className="text-sm text-gray-600">Length Type</label>
                  <select
                    value={tempRule.length_mode || "variable"}
                    onChange={(e) =>
                      setTempRule({
                        ...tempRule,
                        length_mode: e.target.value as any,
                      })
                    }
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="variable">Variable</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>

                {/* VARIABLE */}
                {tempRule.length_mode !== "fixed" && (
                  <div className="grid grid-cols-2 gap-3">
                    {/* STRING TYPES */}
                    {["string", "alphabetic", "email", "boolean"].includes(
                      currentDataType,
                    ) && (
                      <>
                        <input
                          type="number"
                          placeholder="Min Value"
                          value={tempRule.min || ""}
                          onChange={(e) =>
                            setTempRule({ ...tempRule, min: e.target.value })
                          }
                          className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max Value"
                          value={tempRule.max || ""}
                          onChange={(e) =>
                            setTempRule({ ...tempRule, max: e.target.value })
                          }
                          className="border rounded-lg px-3 py-2 text-sm"
                        />
                      </>
                    )}

                    {/* NUMBER */}
                    {["integer", "float"].includes(currentDataType) && (
                      <>
                        <input
                          type="number"
                          placeholder="Min Length"
                          value={tempRule.min || ""}
                          onChange={(e) =>
                            setTempRule({ ...tempRule, min: e.target.value })
                          }
                          className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max Length"
                          value={tempRule.max || ""}
                          onChange={(e) =>
                            setTempRule({ ...tempRule, max: e.target.value })
                          }
                          className="border rounded-lg px-3 py-2 text-sm"
                        />
                      </>
                    )}

                    {/* DATE */}
                    {currentDataType === "date" && (
                      <>
                        <input
                          type="date"
                          value={tempRule.min || ""}
                          onChange={(e) =>
                            setTempRule({ ...tempRule, min: e.target.value })
                          }
                          className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                          type="date"
                          value={tempRule.max || ""}
                          onChange={(e) =>
                            setTempRule({ ...tempRule, max: e.target.value })
                          }
                          className="border rounded-lg px-3 py-2 text-sm"
                        />
                      </>
                    )}
                  </div>
                )}
                {/* FIXED */}
                {tempRule.length_mode === "fixed" && (
                  <input
                    type="number"
                    placeholder="Fixed Length"
                    value={tempRule.fixed || ""}
                    onChange={(e) =>
                      setTempRule({ ...tempRule, fixed: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                )}
              </div>
            )}
            {tempRule.type === "date_format" && (
              <div className="mb-4">
                <label className="text-sm text-gray-600">
                  Select Date Format
                </label>

                <select
                  value={tempRule.date_format || "YYYY-MM-DD"}
                  onChange={(e) =>
                    setTempRule({
                      ...tempRule,
                      date_format: e.target.value,
                    })
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                >
                  {date_format_options.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {tempRule.type === "data_redundant" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">
                    Redundant Value
                  </label>
                  <input
                    type="text"
                    value={tempRule.data_redundant_value || ""}
                    onChange={(e) =>
                      setTempRule({
                        ...tempRule,
                        data_redundant_value: e.target.value,
                      })
                    }
                    placeholder="Enter value"
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Threshold</label>
                  <input
                    type="number"
                    value={tempRule.data_redundant_threshold || ""}
                    onChange={(e) =>
                      setTempRule({
                        ...tempRule,
                        data_redundant_threshold: e.target.value,
                      })
                    }
                    placeholder="Enter threshold"
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            {tempRule.type === "regex" && (
              <div>
                <label className="text-sm text-gray-600">
                  Cell Contains (Regex)
                </label>
                <input
                  type="text"
                  value={tempRule.cell_contains_value || ""}
                  onChange={(e) =>
                    setTempRule({
                      ...tempRule,
                      cell_contains_value: e.target.value,
                    })
                  }
                  placeholder="e.g. ^[A-Za-z]+$"
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {tempRule.type === "fixed_headers" && (
              <TagInputRule
                label="Header"
                values={tempRule.fixed_headers || []}
                onChange={(val) =>
                  setTempRule({ ...tempRule, fixed_headers: val })
                }
              />
            )}
            {tempRule.type === "cell_start_with" && (
              <TagInputRule
                label="Start Value"
                values={tempRule.cell_start_with || []}
                onChange={(val) =>
                  setTempRule({ ...tempRule, cell_start_with: val })
                }
              />
            )}
            {tempRule.type === "cell_end_with" && (
              <TagInputRule
                label="End Value"
                values={tempRule.cell_end_with || []}
                onChange={(val) =>
                  setTempRule({ ...tempRule, cell_end_with: val })
                }
              />
            )}
            {tempRule.type === "not_match_found" && (
              <TagInputRule
                label="Blocked Value"
                values={tempRule.not_match_found || []}
                onChange={(val) =>
                  setTempRule({ ...tempRule, not_match_found: val })
                }
              />
            )}

            {tempRule.type === "dependency" && (
              <div className="space-y-5">
                {/* MAIN */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Main Dependency
                  </label>

                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="dependency_mode"
                        checked={
                          (tempRule.dependency_mode ?? "required") ===
                          "required"
                        }
                        onChange={() =>
                          setTempRule({
                            ...tempRule,
                            dependency_mode: "required",
                          })
                        }
                      />
                      Required
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="dependency_mode"
                        checked={
                          (tempRule.dependency_mode ?? "required") === "other"
                        }
                        onChange={() =>
                          setTempRule({
                            ...tempRule,
                            dependency_mode: "other",
                          })
                        }
                      />
                      Other Value
                    </label>
                  </div>

                  {(tempRule.dependency_mode ?? "required") === "other" && (
                    <input
                      type="text"
                      placeholder="Enter value"
                      value={tempRule.other_value_main_dependency ?? ""}
                      onChange={(e) =>
                        setTempRule({
                          ...tempRule,
                          other_value_main_dependency: e.target.value,
                        })
                      }
                      className="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
                    />
                  )}
                </div>

                {/* SUB DEPENDENCY COMPONENT */}
                <SubDependencySection
                  tempRule={tempRule}
                  setTempRule={setTempRule}
                  headers={data.map((h) => h.name)}
                  currentHeader={current.name}
                />
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTempRule({});
                }}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>
              {tempRule.type}
              {tempRule.data_type}
              <button
                onClick={() => {
                  applyRule();
                }}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowValidationRules;
