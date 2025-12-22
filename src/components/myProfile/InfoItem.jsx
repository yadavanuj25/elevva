const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1 capitalize">{label}</p>
    <p className="text-sm font-medium text-gray-800 dark:text-white ">
      {value || "-"}
    </p>
  </div>
);
export default InfoItem;
