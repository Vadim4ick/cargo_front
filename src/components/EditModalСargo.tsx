import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Cargo, Truck } from "@/services/truck.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ru } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useUpdateCargoById } from "@/hooks/useUpdateCargoById";
import { useQueryClient } from "@tanstack/react-query";

interface EditModalProps {
  cargo: Cargo;
  onClose: () => void;
}

export const EditModalCargo = ({
  cargo,
  trucks,
  onClose,
}: EditModalProps & { trucks?: Truck[] }) => {
  const [formData, setFormData] = useState<Cargo>(cargo);

  const { mutate, isPending } = useUpdateCargoById();

  const queryClient = useQueryClient();
  // Обновление локального состояния при изменении cargo
  useEffect(() => {
    setFormData(cargo);
  }, [cargo]);

  const handleSave = () => {
    const formDate = new FormData();
    formDate.append("cargoNumber", formData.cargoNumber);
    formDate.append("date", formData.date);
    formDate.append("loadUnloadDate", formData.loadUnloadDate);
    formDate.append("transportationInfo", formData.transportationInfo);
    formDate.append("driver", formData.driver);
    formDate.append("payoutAmount", String(formData.payoutAmount));
    formDate.append("payoutDate", formData.payoutDate);
    formDate.append("paymentStatus", formData.paymentStatus);
    formDate.append("payoutTerms", formData.payoutTerms);
    formDate.append("truckId", formData.truckId.toString());

    mutate(
      {
        id: cargo.id.toString(),
        body: formDate,
      },
      {
        onSuccess: () => {
          toast.success("Груз успешно обновлен");

          queryClient.invalidateQueries({
            queryKey: ["cargos"],
          });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={Boolean(cargo)} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактировать груз</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Номер груза */}
          <div>
            <Label htmlFor="cargoNumber">Номер груза</Label>
            <Input
              id="cargoNumber"
              type="text"
              value={formData.cargoNumber}
              onChange={(e) =>
                setFormData({ ...formData, cargoNumber: e.target.value })
              }
            />
          </div>
          {/* Дата груза */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="date">Дата груза</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  {formData.date ? formData.date : <span>Выберите дату</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={{
                    ...ru,
                    options: {
                      ...ru.options,
                      weekStartsOn: 1,
                    },
                  }}
                  selected={
                    formData.date ? new Date(formData.date) : new Date()
                  }
                  onSelect={(day: Date | undefined) => {
                    if (!day) return;
                    setFormData({
                      ...formData,
                      date: format(day, "dd.MM.yyyy"),
                    });
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Дата погрузки/разгрузки */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="loadUnloadDate">Дата погрузки/разгрузки</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !formData.loadUnloadDate && "text-muted-foreground"
                  )}
                >
                  {formData.loadUnloadDate ? (
                    formData.loadUnloadDate
                  ) : (
                    <span>Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={{
                    ...ru,
                    options: {
                      ...ru.options,
                      weekStartsOn: 1,
                    },
                  }}
                  selected={
                    formData.loadUnloadDate
                      ? new Date(formData.loadUnloadDate)
                      : new Date()
                  }
                  onSelect={(day: Date | undefined) => {
                    if (!day) return;
                    setFormData({
                      ...formData,
                      loadUnloadDate: format(day, "dd.MM.yyyy"),
                    });
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Информация о перевозке */}
          <div>
            <Label htmlFor="transportationInfo">Информация о перевозке</Label>
            <Textarea
              id="transportationInfo"
              value={formData.transportationInfo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  transportationInfo: e.target.value,
                })
              }
            />
          </div>
          {/* Водитель */}
          <div>
            <Label htmlFor="driver">Водитель</Label>
            <Input
              id="driver"
              type="text"
              value={formData.driver}
              onChange={(e) =>
                setFormData({ ...formData, driver: e.target.value })
              }
            />
          </div>
          {/* Сумма выплаты */}
          <div>
            <Label htmlFor="payoutAmount">Сумма выплаты</Label>
            <Input
              id="payoutAmount"
              type="number"
              value={formData.payoutAmount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payoutAmount: Number(e.target.value),
                })
              }
            />
          </div>
          {/* Дата выплаты */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="payoutDate">Дата выплаты</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !formData.payoutDate && "text-muted-foreground"
                  )}
                >
                  {formData.payoutDate ? (
                    formData.payoutDate
                  ) : (
                    <span>Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  locale={{
                    ...ru,
                    options: {
                      ...ru.options,
                      weekStartsOn: 1,
                    },
                  }}
                  selected={
                    formData.payoutDate
                      ? new Date(formData.payoutDate)
                      : new Date()
                  }
                  onSelect={(day: Date | undefined) => {
                    if (!day) return;
                    setFormData({
                      ...formData,
                      payoutDate: format(day, "dd.MM.yyyy"),
                    });
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* Статус оплаты */}
          <div>
            <Label htmlFor="paymentStatus">Статус оплаты</Label>
            <Input
              id="paymentStatus"
              type="text"
              value={formData.paymentStatus}
              onChange={(e) =>
                setFormData({ ...formData, paymentStatus: e.target.value })
              }
            />
          </div>
          {/* Условия выплаты */}
          <div>
            <Label htmlFor="payoutTerms">Условия выплаты</Label>
            <Input
              id="payoutTerms"
              type="text"
              value={formData.payoutTerms}
              onChange={(e) =>
                setFormData({ ...formData, payoutTerms: e.target.value })
              }
            />
          </div>
          {/* Выбор машины */}
          {trucks && (
            <div>
              <Label htmlFor="truckId">Выберите машину</Label>
              <Select
                value={formData.truckId}
                onValueChange={(value) =>
                  setFormData({ ...formData, truckId: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите машину" />
                </SelectTrigger>
                <SelectContent>
                  {trucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id.toString()}>
                      {truck.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button disabled={isPending} variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button disabled={isPending} onClick={handleSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
