"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ViewIcon } from "lucide-react";
import { useGetAllTrucks } from "@/hooks/useGetAllTrucks";
import { Cargo } from "@/services/truck.service";

export default function Home() {
  const { trucks, isLoading } = useGetAllTrucks();

  // Состояние для выбранного таба (грузовика)
  const [activeTruckIndex, setActiveTruckIndex] = useState(0);
  const activeTruck =
    !isLoading && trucks && trucks.length > 0 ? trucks[activeTruckIndex] : null;

  // Определяем колонки таблицы
  const columns: ColumnDef<Cargo>[] = useMemo(
    () => [
      {
        header: "Номер груза",
        accessorKey: "cargoNumber",
      },
      {
        header: "Дата",
        accessorKey: "date",
        cell: ({ getValue }) =>
          new Date(getValue() as string).toLocaleDateString(),
      },
      {
        header: "Информация о перевозке",
        accessorKey: "transportationInfo",
      },
      {
        header: "Сумма выплаты",
        accessorKey: "payoutAmount",
        cell: (info) => `$${info.getValue()}`,
      },
      {
        header: "Условия выплаты",
        accessorKey: "payoutTerms",
      },
      {
        header: "Редактировать",
        id: "edit",
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            onChange={() => console.log("Toggle edit for", row.original)}
          />
        ),
      },
      {
        header: "Подробнее",

        style: {
          maxWidth: "100px",
        },
        id: "details",
        cell: () => (
          <button className="w-[150px] flex justify-center items-center">
            <ViewIcon />
          </button>
        ),
      },
    ],
    []
  );

  // Состояние данных для таблицы и пагинации
  const [data, setData] = useState<Cargo[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // При переключении грузовика обновляем данные таблицы и сбрасываем пагинацию
  useEffect(() => {
    if (activeTruck) {
      setData(activeTruck?.cargos);
      setPagination({ pageIndex: 0, pageSize: 5 });
    }
  }, [activeTruck]);

  // Создаем экземпляр таблицы с поддержкой пагинации
  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-gray-100 flex flex-col h-full">
      <section className="py-12 bg-white h-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Данные о перевозках
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-[400px] flex flex-col justify-between">
            <div>
              {/* Навигация табов */}
              <div className="mb-4 border-b border-gray-200">
                <nav className="flex space-x-4">
                  {trucks?.map((truck, index) => (
                    <button
                      key={truck.id}
                      onClick={() => setActiveTruckIndex(index)}
                      className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                        activeTruckIndex === index
                          ? "border-b-2 border-blue-500 text-blue-500"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {truck.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Таблица */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Пагинация */}
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="text-sm text-gray-700">
                  Страница {table.getState().pagination.pageIndex + 1} из{" "}
                  {table.getPageCount()}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Предыдущая
                </button>
                <button
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Следующая
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
