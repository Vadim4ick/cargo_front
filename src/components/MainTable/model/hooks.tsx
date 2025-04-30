import { Button } from "@/components/ui/button";
import { Cargo } from "@/services/truck.service";
import { useProfile } from "@/store/profile";
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
  const { user: profile } = useProfile();

  // Определяем колонки таблицы
  const columns: ColumnDef<Cargo>[] = useMemo(() => {
    const cols: ColumnDef<Cargo>[] = [
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
        header: "Подробнее",
        id: "details",

        cell: ({ row }) => (
          <button
            style={{ maxWidth: "80px" }}
            onClick={() => handleViewDetails(row.original)}
            className="flex justify-center items-center w-full"
          >
            <ViewIcon />
          </button>
        ),
      },
    ];

    if (profile?.role !== "USER") {
      cols.splice(cols.length - 1, 0, {
        header: "Редактировать",
        id: "edit",

        cell: ({ row }) => (
          <Button
            style={{ maxWidth: "180px" }}
            onClick={() => handleEdit(row.original)}
            variant="outline"
          >
            Редактировать
          </Button>
        ),
      });
    }

    return cols;
  }, [handleEdit, handleViewDetails, profile?.role]);

  return columns;
};
