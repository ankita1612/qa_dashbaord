import React, { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  label: string;
  values: string[];
  onChange: (val: string[]) => void;
};

const TagInputRule: React.FC<Props> = ({ label, values, onChange }) => {
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (!input.trim()) {
      toast.error(`Please enter ${label}`);
      return;
    }

    if (values.includes(input.trim())) {
      toast.error(`${label} already exists`);
      return;
    }

    onChange([...values, input.trim()]);
    setInput("");
    toast.success(`${label} added`);
  };

  const handleDelete = (idx: number) => {
    const updated = [...values];
    updated.splice(idx, 1);
    onChange(updated);
    toast.success("Deleted");
  };

  const handleSaveEdit = (idx: number) => {
    if (!editValue.trim()) {
      toast.error("Value cannot be empty");
      return;
    }

    const updated = [...values];
    updated[idx] = editValue.trim();
    onChange(updated);

    setEditIndex(null);
    toast.success("Updated");
  };

  return (
    <div className="space-y-4">
      {/* INPUT */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter ${label}`}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />

        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
        >
          Add
        </button>

        {input && (
          <button onClick={() => setInput("")} className="text-gray-500">
            ✕
          </button>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {values.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border rounded-lg px-3 py-2 bg-gray-50"
          >
            {editIndex === idx ? (
              <div className="flex gap-2 w-full">
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />

                <button
                  onClick={() => handleSaveEdit(idx)}
                  className="text-green-600 text-sm"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditIndex(null)}
                  className="text-gray-500 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm">{item}</span>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditIndex(idx);
                      setEditValue(item);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(idx)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagInputRule;
