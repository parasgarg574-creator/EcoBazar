const Table = ({
    columns = [],
    data = [],
    emptyMessage = "No data found",
    onView,
    onEdit,
    onDelete,
    canView = true,
    canEdit = true,
    canDelete = true,
}) => {
    const showActionsColumn = Boolean(onView || onEdit || onDelete);
    const allColumns = [
        ...columns,
        ...(showActionsColumn
            ? [
                  {
                      key: "actions",
                      label: "Actions",
                      render: (item) => {
                          const rowId = item?._id || item?.id;
                          const showView = Boolean(onView && canView);
                          const showEdit = Boolean(onEdit && canEdit);
                          const showDelete = Boolean(onDelete && canDelete);

                          if (!showView && !showEdit && !showDelete) {
                              return <span className="text-sm text-gray-400">-</span>;
                          }

                          return (
                              <div className="flex gap-2">
                                  {showView && (
                                      <button
                                          onClick={() => onView(rowId)}
                                          className="rounded bg-blue-500 px-3 py-1 text-sm text-white"
                                      >
                                          View
                                      </button>
                                  )}
                                  {showEdit && (
                                      <button
                                          onClick={() => onEdit(rowId)}
                                          className="rounded bg-green-500 px-3 py-1 text-sm text-white"
                                      >
                                          Edit
                                      </button>
                                  )}
                                  {showDelete && (
                                      <button
                                          onClick={() => onDelete(rowId)}
                                          className="rounded bg-red-500 px-3 py-1 text-sm text-white"
                                      >
                                          Delete
                                      </button>
                                  )}
                              </div>
                          );
                      },
                  },
              ]
            : []),
    ];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full overflow-hidden rounded-lg border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {allColumns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={item?._id || item?.id || item?.email || index}>
                                {allColumns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`whitespace-nowrap px-6 py-4 ${
                                            column.className || ""
                                        }`}
                                    >
                                        {column.render
                                            ? column.render(item, index)
                                            : item?.[column.key] ?? "-"}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={allColumns.length}
                                className="px-6 py-8 text-center text-gray-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
export default Table;
