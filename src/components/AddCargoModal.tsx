import React, { useState } from "react";
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
import { useAddCargo } from "@/hooks/useAddCargo";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";

interface AddCargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  trucks?: Truck[];
}

type AddCargo = Omit<Cargo, "id" | "createdAt">;

const AddCargoModal: React.FC<AddCargoModalProps> = ({
  isOpen,
  onClose,
  trucks,
}) => {
  const { mutate, isPending } = useAddCargo();

  const [formData, setFormData] = useState<AddCargo>({
    cargoNumber: "",
    date: "",
    transportationInfo: "",
    payoutAmount: 0,
    payoutTerms: "",
    truckId: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.cargoNumber.trim()) {
      newErrors.cargoNumber = "Номер груза обязателен";
    }
    if (!formData.date) {
      newErrors.date = "Дата обязательна";
    }
    if (!formData.transportationInfo.trim()) {
      newErrors.transportationInfo = "Информация о перевозке обязательна";
    }
    if (formData.payoutAmount <= 0) {
      newErrors.payoutAmount = "Сумма выплаты должна быть больше 0";
    }
    if (!formData.payoutTerms.trim()) {
      newErrors.payoutTerms = "Условия выплаты обязательны";
    }
    if (!formData.truckId) {
      newErrors.truckId = "Выберите машину";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) {
      toast.error("Пожалуйста, заполните все обязательные поля корректно");
      return;
    }
    const formDate = new FormData();
    formDate.append("cargoNumber", formData.cargoNumber);
    // Преобразуем строку в дату для отправки в виде ISO-формата
    formDate.append(
      "date",
      parse(formData.date, "dd.MM.yyyy", new Date()).toISOString()
    );
    formDate.append("transportationInfo", formData.transportationInfo);
    formDate.append("payoutAmount", String(formData.payoutAmount));
    formDate.append("payoutTerms", formData.payoutTerms);
    formDate.append("truckId", formData.truckId);

    mutate(
      {
        body: formDate,
      },
      {
        onSuccess: () => {
          toast.success("Груз успешно добавлен");
          setFormData({
            cargoNumber: "",
            date: "",
            transportationInfo: "",
            payoutAmount: 0,
            payoutTerms: "",
            truckId: "",
          });
          setErrors({});

          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить груз</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="cargoNumber">Номер груза</Label>
            <Input
              id="cargoNumber"
              type="text"
              value={formData.cargoNumber}
              onChange={(e) =>
                setFormData({ ...formData, cargoNumber: e.target.value })
              }
              className={errors.cargoNumber ? "border-red-500" : ""}
            />
            {errors.cargoNumber && (
              <p className="text-red-500 text-sm">{errors.cargoNumber}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="data">Дата груза</Label>

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
                    formData.date
                      ? parse(formData.date, "dd.MM.yyyy", new Date())
                      : new Date()
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
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
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
              className={errors.transportationInfo ? "border-red-500" : ""}
            />
            {errors.transportationInfo && (
              <p className="text-red-500 text-sm">
                {errors.transportationInfo}
              </p>
            )}
          </div>
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
              className={errors.payoutAmount ? "border-red-500" : ""}
            />
            {errors.payoutAmount && (
              <p className="text-red-500 text-sm">{errors.payoutAmount}</p>
            )}
          </div>
          <div>
            <Label htmlFor="payoutTerms">Условия выплаты</Label>
            <Input
              id="payoutTerms"
              type="text"
              value={formData.payoutTerms}
              onChange={(e) =>
                setFormData({ ...formData, payoutTerms: e.target.value })
              }
              className={errors.payoutTerms ? "border-red-500" : ""}
            />
            {errors.payoutTerms && (
              <p className="text-red-500 text-sm">{errors.payoutTerms}</p>
            )}
          </div>
        </div>

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
              {trucks?.map((truck) => (
                <SelectItem key={truck.id} value={truck.id.toString()}>
                  {truck.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.truckId && (
            <p className="text-red-500 text-sm">{errors.truckId}</p>
          )}
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button disabled={isPending} variant="outline">
              Отмена
            </Button>
          </DialogClose>
          <Button disabled={isPending} onClick={handleAdd}>
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AddCargoModal };
