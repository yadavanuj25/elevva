const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-darkBg rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-600">
      <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default Section;
