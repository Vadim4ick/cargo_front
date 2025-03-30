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
import { cn, validate } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useAddCargo } from "@/hooks/useAddCargo";
import { useUpdateCargoById } from "@/hooks/useUpdateCargoById";
import { useQueryClient } from "@tanstack/react-query";

interface CargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  trucks?: Truck[];
  cargo?: Cargo; // Если cargo передан – это режим редактирования
}

const CargoModal: React.FC<CargoModalProps> = ({
  isOpen,
  onClose,
  trucks,
  cargo,
}) => {
  // Определяем режим
  const isEditMode = Boolean(cargo);

  // Используем начальное состояние: если редактирование – берем cargo, иначе устанавливаем значения по умолчанию
  const [formData, setFormData] = useState({
    cargoNumber: "",
    date: "",
    loadUnloadDate: "",
    transportationInfo: "",
    driver: "",
    payoutAmount: 0,
    payoutDate: "",
    paymentStatus: "",
    payoutTerms: "",
    truckId: "",
    ...cargo,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Обновляем локальное состояние при изменении cargo (режим редактирования)
  useEffect(() => {
    if (cargo) {
      setFormData({
        cargoNumber: cargo.cargoNumber,
        date: cargo.date,
        loadUnloadDate: cargo.loadUnloadDate,
        transportationInfo: cargo.transportationInfo,
        driver: cargo.driver,
        payoutAmount: cargo.payoutAmount,
        payoutDate: cargo.payoutDate,
        paymentStatus: cargo.paymentStatus,
        payoutTerms: cargo.payoutTerms,
        truckId: cargo.truckId.toString(),
      });
    } else {
      setFormData({
        cargoNumber: "",
        date: "",
        loadUnloadDate: "",
        transportationInfo: "",
        driver: "",
        payoutAmount: 0,
        payoutDate: "",
        paymentStatus: "",
        payoutTerms: "",
        truckId: "",
      });
    }
  }, [cargo]);

  const addMutation = useAddCargo();
  const updateMutation = useUpdateCargoById();
  const queryClient = useQueryClient();

  const handleSubmit = () => {
    // Если в режиме добавления, можно добавить дополнительную валидацию
    if (!isEditMode && !validate(formData, setErrors)) {
      toast.error("Пожалуйста, заполните все обязательные поля корректно");
      return;
    }

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
    formDate.append("truckId", formData.truckId);

    if (isEditMode) {
      updateMutation.mutate(
        {
          id: cargo!.id.toString(),
          body: formDate,
        },
        {
          onSuccess: () => {
            toast.success("Груз успешно обновлен");
            queryClient.invalidateQueries({ queryKey: ["cargos"] });
            onClose();
          },
        }
      );
    } else {
      addMutation.mutate(
        {
          body: formDate,
        },
        {
          onSuccess: () => {
            toast.success("Груз успешно добавлен");
            // Сброс формы
            setFormData({
              cargoNumber: "",
              date: "",
              loadUnloadDate: "",
              transportationInfo: "",
              driver: "",
              payoutAmount: 0,
              payoutDate: "",
              paymentStatus: "",
              payoutTerms: "",
              truckId: "",
            });
            setErrors({});
            onClose();
            queryClient.invalidateQueries({ queryKey: ["cargos"] });
          },
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Редактировать груз" : "Добавить груз"}
          </DialogTitle>
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
              className={errors.cargoNumber ? "border-red-500" : ""}
            />
            {errors.cargoNumber && (
              <p className="text-red-500 text-sm">{errors.cargoNumber}</p>
            )}
          </div>
          {/* Пример для даты (остальные поля аналогично) */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="date">
                {isEditMode ? "Дата груза" : "Дата заявки"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal w-full",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    {formData.date || <span>Выберите дату</span>}
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
            {/* Аналогичный блок для loadUnloadDate */}
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="loadUnloadDate">
                {isEditMode ? "Дата погрузки/разгрузки" : "Дата погрузки"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.loadUnloadDate && "text-muted-foreground"
                    )}
                  >
                    {formData.loadUnloadDate || <span>Выберите дату</span>}
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
                        ? parse(
                            formData.loadUnloadDate,
                            "dd.MM.yyyy",
                            new Date()
                          )
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
              {errors.loadUnloadDate && (
                <p className="text-red-500 text-sm">{errors.loadUnloadDate}</p>
              )}
            </div>
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
              {errors.truckId && (
                <p className="text-red-500 text-sm">{errors.truckId}</p>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button
              disabled={addMutation.isPending || updateMutation.isPending}
              variant="outline"
            >
              Отмена
            </Button>
          </DialogClose>
          <Button
            disabled={addMutation.isPending || updateMutation.isPending}
            onClick={handleSubmit}
          >
            {isEditMode ? "Сохранить" : "Добавить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CargoModal };
