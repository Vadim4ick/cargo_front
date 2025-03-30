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
        cell: ({ getValue }) => getValue(),
      },
      // {
      //   header: "Информация о перевозке",
      //   accessorKey: "transportationInfo",
      // },
      {
        header: "Дата загрузки",
        accessorKey: "loadUnloadDate",
      },
      {
        header: "Водитель",
        accessorKey: "driver",
      },
      {
        header: "Сумма выплаты",
        accessorKey: "payoutAmount",
        cell: (info) => `$${info.getValue()}`,
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
