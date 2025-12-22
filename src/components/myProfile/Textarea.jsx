const Textarea = ({ label, ...props }) => (
  <div className="md:col-span-2">
    <label className="block text-xs text-gray-500 mb-1 capitalize">
      {label}
    </label>
    <textarea
      rows="3"
      {...props}
      className="w-full p-2 rounded-md border text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-darkBg"
    />
  </div>
);

export default Textarea;
