import Tabs from "../ui/tableComponents/Tabs";
import TableHeader from "../ui/tableComponents/TableHeader";

const ListPageLayout = ({
  title,
  tabs,
  resource,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  addLink,
  children,
}) => {
  return (
    <>
      <h2 className=" mb-4">{title}</h2>

      <Tabs
        statusTabs={tabs}
        activeTab={activeTab}
        handleTabChange={onTabChange}
      />

      <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border">
        <TableHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          addLink={addLink}
          title={title}
          resource={resource}
        />
        {children}
      </div>
    </>
  );
};

export default ListPageLayout;
