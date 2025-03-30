import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTableColumns } from "../model/hooks";
import { useGetCargosByTruck } from "@/hooks/useGetCargosByTruck";
import { useEffect, useState } from "react";
import { Cargo } from "@/services/truck.service";
import { CargoModal } from "@/components/CargoModal";

const MainTable = ({
  truckId,
  pagination,
  setPagination,
}: {
  truckId: string;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
}) => {
  const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);

  const handleEdit = (cargo: Cargo) => {
    setSelectedCargo(cargo);
  };

  const closeModal = () => {
    setSelectedCargo(null);
  };

  const columns = useTableColumns({ handleEdit });

  useEffect(() => {
    setPagination({ pageIndex: 0, pageSize: 10 });
  }, [setPagination, truckId]);

  useEffect(() => {
    const currentPageCount = Math.ceil(
      (data?.data.total ?? 0) / pagination.pageSize
    );

    if (pagination.pageIndex >= currentPageCount && currentPageCount > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: currentPageCount - 1,
      }));
    }
  }, [pagination.pageIndex, pagination.pageSize, setPagination]);

  const { data, isLoading } = useGetCargosByTruck({
    id: truckId,
    page: pagination.pageIndex,
    limit: pagination.pageSize,
  });

  const table = useReactTable({
    data: data?.data.data ?? [],
    columns,
    pageCount: Math.ceil((data?.data.total ?? 0) / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const customClass =
                  header.column.id === "edit" || header.column.id === "details"
                    ? "w-[100px] items-center"
                    : "";

                return (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${customClass}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <tr key={index}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-6 text-center text-gray-500 text-sm"
              >
                Нет данных для отображения
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Пагинация */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3 border-t bg-gray-50">
        <span className="text-sm text-gray-700">
          Страница {table.getState().pagination.pageIndex + 1} из{" "}
          {table.getPageCount()}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={isLoading || !table.getCanPreviousPage()}
            className="px-4 py-2 rounded-md border text-sm font-medium text-gray-600 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Предыдущая
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={isLoading || !table.getCanNextPage()}
            className="px-4 py-2 rounded-md border text-sm font-medium text-gray-600 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Следующая →
          </button>
        </div>
      </div>

      {selectedCargo && (
        <CargoModal
          isOpen={Boolean(selectedCargo)}
          cargo={selectedCargo}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export { MainTable };
