import { Button } from "@/components/ui/button";
import { Cargo } from "@/services/truck.service";
import { ColumnDef } from "@tanstack/react-table";
import { ViewIcon } from "lucide-react";
import { useMemo } from "react";

export const useTableColumns = ({
  handleEdit,
  handleViewDetails,
}: {
  handleEdit: (val: Cargo) => void;
  handleViewDetails: (val: Cargo) => void;
}) => {
  // Определяем колонки таблицы
  const columns: ColumnDef<Cargo>[] = useMemo(
    () => [
      {
        header: "Номер груза",
        accessorKey: "cargoNumber",
      },
      {
        header: "Дата заявки",
        accessorKey: "date",
        cell: ({ getValue }) => {
          const rawValue = getValue() as Date;

          return new Date(rawValue).toLocaleDateString("ru-RU");
        },
      },
      // {
      //   header: "Информация о перевозке",
      //   accessorKey: "transportationInfo",
      // },
      {
        header: "Дата загрузки",
        accessorKey: "loadUnloadDate",
        cell: ({ getValue }) => {
          const rawValue = getValue() as Date;

          return new Date(rawValue).toLocaleDateString("ru-RU");
        },
      },
      {
        header: "Водитель",
        accessorKey: "driver",
      },
      {
        header: "Сумма выплаты",
        accessorKey: "payoutAmount",
        cell: (info) => `${info.getValue()} Р`,
      },

      {
        header: "Статус выплаты",
        accessorKey: "paymentStatus",
      },
      {
        header: "Редактировать",
        id: "edit",
        style: { maxWidth: "80px" },
        cell: ({ row }) => {
          return (
            <Button onClick={() => handleEdit(row.original)} variant="outline">
              Редактировать
            </Button>
          );
        },
      },
      {
        header: "Подробнее",
        id: "details",
        style: { maxWidth: "80px" },
        cell: ({ row }) => (
          <button
            onClick={() => handleViewDetails(row.original)}
            className="flex justify-center items-center w-full"
          >
            <ViewIcon />
          </button>
        ),
      },
    ],
    []
  );

  return columns;
};
