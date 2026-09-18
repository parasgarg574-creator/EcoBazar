const Loader = ({ label = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-10 w-10 border-4",
  };

  return (
    <div className="flex items-center justify-center gap-3 text-sm text-gray-500" role="status" aria-live="polite">
      <span
        className={`animate-spin rounded-full border-green-200 border-t-green-600 ${sizeClasses[size] || sizeClasses.md}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
};
export default Loader;
