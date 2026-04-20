import StatusBadge from "./StatusBadge";

export default function PaymentTable({ columns, rows, emptyText = "Belum ada data", actions }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
              {actions ? <th className="px-4 py-3 font-semibold">Aksi</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="transition hover:bg-slate-50/80">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 align-top text-slate-700">
                      {column.key === "status" ? (
                        <StatusBadge status={row[column.key]} />
                      ) : column.render ? (
                        column.render(row[column.key], row)
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                  {actions ? <td className="px-4 py-4 align-top">{actions(row)}</td> : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
