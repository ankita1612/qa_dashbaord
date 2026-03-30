const SummaryCard = ({ title, value, success, error }: any) => {
  return (
    <div
      className={`p-4 rounded-xl border shadow-sm ${
        success
          ? "bg-green-50 border-green-100"
          : error
            ? "bg-red-50 border-red-100"
            : "bg-gray-50"
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p
        className={`text-xl font-semibold ${
          success ? "text-green-600" : error ? "text-red-600" : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default SummaryCard;
