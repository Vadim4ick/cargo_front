import { Cargo } from "@/services/truck.service";
import { ColumnDef } from "@tanstack/react-table";
import { ViewIcon } from "lucide-react";
import { useMemo } from "react";
import { EditModalСargo } from "../../EditModalСargo";

export const useTableColumns = () => {
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

  return columns;
};
