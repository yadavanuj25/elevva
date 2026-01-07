const SuccessBanner = ({ message, onClose }) => {
  return (
    <div className="bg-green-200  border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
      <span>{message}</span>
      <button onClick={onClose} className="text-green-600 hover:text-green-800">
        ×
      </button>
    </div>
  );
};

export default SuccessBanner;
