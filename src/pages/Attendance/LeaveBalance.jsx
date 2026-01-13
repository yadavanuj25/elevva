import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getLeaveBalance } from "../../services/leaveService";

const LeaveBalance = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBalance = async () => {
      const data = await getLeaveBalance(user.id);
      setBalance(data);
      setLoading(false);
    };
    loadBalance();
  }, [user.id]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading leave balance...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1">Leave Balance</h2>
      <p className="text-sm text-gray-500 mb-4">Your available leave summary</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {balance.map((item) => (
          <div
            key={item.leaveType}
            className="bg-white dark:bg-gray-800 border rounded-lg p-5"
          >
            <h3 className="text-lg font-semibold mb-2">{item.leaveType}</h3>

            <div className="space-y-1 text-sm">
              <p>
                Total: <strong>{item.total}</strong>
              </p>
              <p>
                Used: <strong>{item.used}</strong>
              </p>
              <p>
                Remaining:{" "}
                <strong
                  className={
                    item.remaining <= 2 ? "text-red-600" : "text-green-600"
                  }
                >
                  {item.remaining}
                </strong>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-primary rounded"
                  style={{
                    width: `${(item.used / item.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveBalance;
