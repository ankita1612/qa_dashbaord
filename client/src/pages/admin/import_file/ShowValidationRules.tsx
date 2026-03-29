import { FiTrash2, FiEdit } from "react-icons/fi";
import React, { useState } from "react";
import toast from "react-hot-toast";
type RuleConfig = {
  required?: boolean; // has_empty
  data_type?: string;
};

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

  const [tempRule, setTempRule] = useState<{
    type?: "required" | "data_type" | "data_length";
    required?: boolean;
    data_type?: string;
    length_mode?: "variable" | "fixed";
    min?: any;
    max?: any;
    fixed?: any;
  }>({});
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

  const addRule = () => {
    const updated = [...data];
    updated[selectedHeader].rules.push({ type: "required" });
    setData(updated);
    onRulesChange?.(generateJSON());
  };

  const updateRule = (index: number, key: string, value: any) => {
    const updated = [...data];
    (updated[selectedHeader].rules[index] as any)[key] = value;
    setData(updated);
    onRulesChange?.(generateJSON());
  };

  const removeRule = (index: number) => {
    const updated = [...data];
    updated[selectedHeader].rules.splice(index, 1);
    setData(updated);
    onRulesChange?.(generateJSON());
  };
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

    const updated = [...data];
    const currentHeader = updated[selectedHeader];

    // ======================
    // REQUIRED
    // ======================
    if (tempRule.type === "required") {
      currentHeader.rules = currentHeader.rules.filter(
        (r) => r.type !== "required",
      );

      currentHeader.rules.push({
        type: "required",
        value: tempRule.required ?? true,
      });
    }

    // ======================
    // DATA TYPE
    // ======================
    if (tempRule.type === "data_type") {
      currentHeader.rules = currentHeader.rules.filter(
        (r) => r.type !== "data_type",
      );

      currentHeader.rules.push({
        type: "data_type",
        value: tempRule.data_type || "string", // ✅ fallback
      });
    }

    // ======================
    // DATA LENGTH
    // ======================
    if (tempRule.type === "data_length") {
      currentHeader.rules = currentHeader.rules.filter(
        (r) => r.type !== "data_length",
      );

      currentHeader.rules.push({
        type: "data_length",
        value: {
          mode: tempRule.length_mode || "variable",
          min: tempRule.min || null,
          max: tempRule.max || null,
          fixed: tempRule.fixed || null,
        },
      });
    }

    setData(updated);
    onRulesChange?.(generateJSON());

    setIsModalOpen(false);
    setTempRule({});

    const rule = getRuleName(tempRule.type);
    toast.success(`${rule} rule applied`);
  };
  //   const applyRule = () => {
  //     if (!tempRule.type) {
  //       toast.error("Please select a rule first");
  //       return;
  //     }

  //     if (tempRule.type === "data_type" && !tempRule.data_type) {
  //       toast.error("Please select data type");
  //       return;
  //     }
  //     const updated = [...data];
  //     const currentHeader = updated[selectedHeader];

  //     if (tempRule.type === "required") {
  //       currentHeader.rules = currentHeader.rules.filter(
  //         (r) => r.type !== "required",
  //       );

  //       currentHeader.rules.push({
  //         type: "required",
  //         value: tempRule.required,
  //       });
  //     }

  //     if (tempRule.type === "data_type") {
  //       currentHeader.rules = currentHeader.rules.filter(
  //         (r) => r.type !== "data_type",
  //       );

  //       currentHeader.rules.push({
  //         type: "data_type",
  //         value: tempRule.data_type,
  //       });
  //     }
  //     if (tempRule.type === "data_length") {
  //       currentHeader.rules = currentHeader.rules.filter(
  //         (r) => r.type !== "data_length",
  //       );

  //       currentHeader.rules.push({
  //         type: "data_length",
  //         value: {
  //           mode: tempRule.length_mode || "variable",
  //           min: tempRule.min,
  //           max: tempRule.max,
  //           fixed: tempRule.fixed,
  //         },
  //       });
  //     }
  //     setData(updated);
  //     onRulesChange?.(generateJSON());
  //     setIsModalOpen(false);
  //     const rule = getRuleName(tempRule.type);
  //     setTempRule({});
  //     toast.success(`${rule} rule applied`);
  //   };

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
      });

      if (Object.keys(obj).length > 0) {
        result[item.name] = obj;
      }
    });

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
    if (ruleType === "data_length") return "Data Length";
    return "Rule";
  };

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
          {JSON.stringify(current.rules)}
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
                  </div>
                  {rule.type === "data_length" && (
                    <span>
                      Length:{" "}
                      <b>
                        {rule.value.mode === "fixed"
                          ? `Fixed (${rule.value.fixed})`
                          : `Min ${rule.value.min} - Max ${rule.value.max}`}
                      </b>
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditingRule(true);

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
                onChange={(e) => setTempRule({ type: e.target.value as any })}
                className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                <option value="required">Required</option>
                <option value="data_type">Data Type</option>
                <option value="data_length">Data Length</option>
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
                  value={tempRule.data_type || ""}
                  onChange={(e) =>
                    setTempRule({
                      ...tempRule,
                      data_type: e.target.value,
                    })
                  }
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select Datatype</option>
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
                {/* MODE SELECT */}
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
                {/* VARIABLE MODE */}[{tempRule.data_type}]
                {(!tempRule.length_mode ||
                  tempRule.length_mode === "variable") && (
                  <div className="grid grid-cols-2 gap-3">
                    {/* STRING / EMAIL / BOOLEAN */}
                    {["string", "alphabetic", "email", "boolean"].includes(
                      tempRule.data_type || "",
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
                    {["integer", "float"].includes(
                      tempRule.data_type || "",
                    ) && (
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
                    {tempRule.data_type === "date" && (
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
                {/* FIXED MODE */}
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
