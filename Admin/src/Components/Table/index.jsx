import { Eye, Pencil, Trash2 } from "lucide-react";             
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
                              <div className="flex items-center gap-1">
                                  {showView && (
                                      <button
                                          type="button"
                                          onClick={() => onView(rowId)}
                                          aria-label="View"
                                          title="View"
                                          className="rounded-md p-2 text-blue-600 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      >
                                          <Eye size={17} strokeWidth={2} />
                                      </button>
                                  )}
                                  {showEdit && (
                                      <button
                                          type="button"
                                          onClick={() => onEdit(rowId)}
                                          aria-label="Edit"
                                          title="Edit"
                                          className="rounded-md p-2 text-green-600 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                                         >
                                          <Pencil size={17} strokeWidth={2} />
                                      </button>
                                  )}
                                  {showDelete && (
                                      <button
                                          type="button"
                                          onClick={() => onDelete(rowId)}
                                          aria-label="Delete"
                                          title="Delete"
                                          className="rounded-md p-2 text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                      >
                                          <Trash2 size={17} strokeWidth={2} />
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
        <div className="w-full overflow-hidden">
            <table className="block w-full overflow-hidden rounded-lg border border-gray-200 sm:table">
                <thead className="hidden bg-gray-50 sm:table-header-group">
                    <tr className="sm:table-row">
                        {allColumns.map((column) => (
                            <th
                                key={column.key}
                                className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6"
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="block divide-y divide-gray-200 bg-white sm:table-row-group">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr
                                key={item?._id || item?.id || item?.email || index}
                                className="block border-b border-gray-200 last:border-b-0 sm:table-row"
                            >
                                {allColumns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`flex min-w-0 items-start gap-3 px-3 py-3 text-sm sm:table-cell sm:whitespace-nowrap sm:px-6 sm:py-4 ${
                                            column.className || ""
                                        }`}
                                    >
                                        <span className="w-24 shrink-0 text-xs font-semibold uppercase text-gray-500 sm:hidden">
                                            {column.label}
                                        </span>
                                        <span className="min-w-0 flex-1 wrap-break-word sm:block">
                                            {column.render
                                                ? column.render(item, index)
                                                : item?.[column.key] ?? "-"}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={allColumns.length}
                                className="block px-3 py-8 text-center text-gray-500 sm:table-cell sm:px-6"
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
