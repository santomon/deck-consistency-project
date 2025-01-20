import React from "react";

// Define types for the table data and columns
type TableCell = React.ReactNode;

type TableRow = Record<string, TableCell>;

type TableColumn<T> = {
    header: string; // Column header text
    key: keyof T; // Enforce key to match one in the data
    cellRenderer?: (value: T[keyof T]) => React.ReactNode; // Custom renderer for the cell value
};

interface TableProps<T> {
    columns: TableColumn<T>[]; // List of columns with matching keys
    data: T[]; // List of data rows
}

const Table = <T,>({ columns, data }: TableProps<T>) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                <tr className="bg-gray-100 border-b">
                    {columns.map((col) => (
                        <th
                            key={String(col.key)}
                            className="px-4 py-2 text-left text-gray-600 font-medium border"
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b">
                        {columns.map((col) => (
                            <td
                                key={String(col.key)}
                                className="px-4 py-2 border"
                            >
                                {col.cellRenderer
                                    ? col.cellRenderer(row[col.key])
                                    : (row[col.key] as React.ReactNode)}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
