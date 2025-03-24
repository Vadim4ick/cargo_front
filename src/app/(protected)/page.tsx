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
import { EditModalСargo } from "@/components/EditModalСargo";
import { Button } from "@/components/ui/button";
import { AddCargoModal } from "@/components/AddCargoModal";

// async function urlToFile(
//   url: string,
//   fileName: string,
//   mimeType: string
// ): Promise<File> {
//   const response = await fetch(url);
//   const blob = await response.blob();
//   return new File([blob], fileName, { type: mimeType });
// }

export default function Home() {
  const { trucks, isLoading } = useGetAllTrucks();
  const [addModalOpen, setAddModalOpen] = useState(false);
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // console.log(selectedImage);

  // const { data: cargo, isLoading: cargoLoading } = useGetCargoById({
  //   id: "564085b6-71eb-47fa-86d7-07aa5a87f3ae",
  // });
  // const { mutate } = useUpdateCargoById();

  // console.log(cargo);

  // const onClick = () => {
  //   if (!selectedImage) return;

  //   mutate({
  //     id: "564085b6-71eb-47fa-86d7-07aa5a87f3ae",
  //     body: {
  //       cargoPhoto: selectedImage,
  //     },
  //   });
  // };

  // console.log(cargo);
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
        style: { maxWidth: "80px" },
        cell: ({ row }) => {
          return <EditModalСargo cargo={row.original} />;
        },
      },
      {
        header: "Подробнее",
        id: "details",
        style: { maxWidth: "80px" },
        cell: () => (
          <button className="flex justify-center items-center w-full">
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

          {/* <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Загрузка изображения</h2>
            <ImageUploader
              defaultImage={`http://localhost:3000/${cargo?.cargoPhoto?.url}`}
              onChange={setSelectedImage}
            />
            {selectedImage && (
              <p className="mt-2 text-sm">
                Выбранный файл: {selectedImage.name}
              </p>
            )}

            <button onClick={onClick}>Загрузить</button>
          </div> */}

          <div className="flex items-end justify-end">
            <Button
              onClick={() => setAddModalOpen(true)}
              className="w-full mb-4 max-w-[200px]"
            >
              Добавить груз
            </Button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-[400px] flex flex-col justify-between">
            <div>
              {/* Навигация табов */}
              <div className="mb-4 border-b border-gray-200">
                <nav className="flex space-x-4 overflow-auto">
                  {trucks?.map((truck, index) => (
                    <button
                      key={truck.id}
                      onClick={() => setActiveTruckIndex(index)}
                      className={`py-2 px-4 font-medium text-sm focus:outline-none whitespace-nowrap ${
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
                        {headerGroup.headers.map((header) => {
                          const customClass =
                            header.column.id === "edit" ||
                            header.column.id === "details"
                              ? "w-[100px] items-center"
                              : "";

                          return (
                            <th
                              key={header.id}
                              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${customClass}`}
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
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 text-sm text-gray-900"
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

      <AddCargoModal
        isOpen={addModalOpen}
        trucks={trucks}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
