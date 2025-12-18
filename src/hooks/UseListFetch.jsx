import { useState, useEffect } from "react";

const UseListFetch = ({
  fetchFn,
  initialLimit = 25,
  activeTab,
  searchQuery,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: initialLimit,
  });
  const [tabs, setTabs] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetchFn(
        pagination.page,
        pagination.limit,
        activeTab,
        searchQuery
      );

      setData(res.data || []);
      setPagination((p) => ({
        ...p,
        total: res.pagination?.total || 0,
        pages: res.pagination?.pages || 1,
      }));

      if (res.tabs) setTabs(res.tabs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, activeTab, searchQuery]);

  return {
    data,
    setData,
    loading,
    pagination,
    setPagination,
    tabs,
    fetchData,
  };
};

export default UseListFetch;
