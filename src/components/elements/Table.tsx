import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";

import {
  AccessorColumnDef,
  GroupColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
  Row,
  Table as ReactTable,
  ColumnDef,
} from "@tanstack/react-table";

interface BaseItem {
  id: string | number;
}

// Replace 'any' with more specific types
interface TableProps<T extends BaseItem> {
  columns: (AccessorColumnDef<T, unknown> | GroupColumnDef<T>)[];
  data: T[];
  currentPage?: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  totalPage?: number;
  count?: number;
  pageLink?: string;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  enableClickToNavigate?: boolean; // Optional prop to enable/disable row click navigation
}

// Create a custom checkbox component to handle the 'indeterminate' property
const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  ...rest
}: {
  indeterminate?: boolean;
  className?: string;
} & React.HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={`h-4 w-4 rounded border-gray-300 cursor-pointer ${className}`}
      {...rest}
    />
  );
};

const Table = <T extends BaseItem>({
  columns,
  data,
  currentPage,
  setCurrentPage,
  totalPage,
  count,
  rowSelection = {},
  setRowSelection,
  enableClickToNavigate = true,
}: TableProps<T>) => {
  // Add checkbox column to the beginning of columns array
  const columnsWithCheckbox: ColumnDef<T>[] = [
    {
      id: "select",
      header: ({ table }: { table: ReactTable<T> }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        </div>
      ),
      cell: ({ row }: { row: Row<T> }) => (
        <div
          className="px-1"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click from being triggered
          }}
        >
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
    },
    ...columns,
  ];

  //table
  const table = useReactTable({
    data,
    columns: columnsWithCheckbox,
    onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
    state: {
      rowSelection, //pass the row selection state back to the table instance
    },
    getRowId: (row: T) => row.id.toString(),
    enableRowSelection: true, //enable row selection for all rows
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
  });

  return (
    <div className="w-full bg-white">
      <div className="overflow-x-auto  border border-gray-8 rounded-t-2xl rounded-b-2xl ">
        <table className="w-full ">
          <thead className=" ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="w-full">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`bg-off-white-3 capitalize whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-9 ${
                      header.id === "select" ? "w-12" : ""
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-[#EAECF0] ${
                  enableClickToNavigate ? "cursor-pointer" : ""
                } ${row.getIsSelected() ? "bg-primary-50/30" : ""}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`whitespace-nowrap text-gray-9 px-5 py-5 text-sm font-Poppins font-normal ${
                      cell.column.id !== "select" ? "capitalize" : ""
                    } text-black`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPage && (
        <div className="flex w-full items-center justify-between bg-white px-6 pb-6 pt-8">
          {currentPage && (
            <div className="text-gray-500 font-normal text-base">
              Showing {currentPage} to {totalPage} of {count} entries
            </div>
          )}

          <Pagination
            totalPage={totalPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Table;

interface PaginationProps {
  totalPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>> | undefined;
  currentPage: number | undefined;
}

const generatePageNumbers = (totalPages: number) =>
  Array.from({ length: totalPages }, (_, i) => i + 1);

const Pagination = ({
  totalPage,
  setCurrentPage,
  currentPage,
}: PaginationProps) => {
  const sliceDigit = 8;
  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(sliceDigit);

  const slicePage = () => generatePageNumbers(totalPage).slice(first, last);

  const handlePrevious = () => {
    setFirst((prev) => prev - sliceDigit);
    setLast((prev) => prev - sliceDigit);
  };

  const handleNext = () => {
    setFirst((prev) => prev + sliceDigit);
    setLast((prev) => prev + sliceDigit);
  };

  return (
    <div className="w-fit border border-light-blue-3 flex items-center text-sm font-normal text-gray-500">
      <button
        onClick={handlePrevious}
        className="px-2.5 py-2"
        disabled={first === 0}
      >
        Previous
      </button>

      {first > 0 && (
        <div className="px-2.5 py-2 border border-light-blue-3">...</div>
      )}

      {slicePage().map((num) => (
        <button
          key={num}
          className={`${
            num === currentPage ? "bg-light-blue" : "bg-white"
          } px-2.5 py-2 border border-light-blue-3 hover:bg-blue-3 text-gray-600`}
          onClick={() => setCurrentPage && setCurrentPage(num)}
        >
          {num}
        </button>
      ))}

      {last < totalPage && (
        <div className="px-2.5 py-2 border border-light-blue-3">...</div>
      )}

      <button
        onClick={handleNext}
        className="px-2.5 py-2"
        disabled={last >= totalPage}
      >
        Next
      </button>
    </div>
  );
};
