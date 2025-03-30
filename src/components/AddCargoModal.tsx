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
import { Truck } from "@/services/truck.service";
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
import { AddCargo, cn, validate } from "@/lib/utils";
import { format, parse } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

interface AddCargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  trucks?: Truck[];

  truckId?: string;
  page?: number;
  limit?: number;
}

const AddCargoModal: React.FC<AddCargoModalProps> = ({
  isOpen,
  onClose,
  trucks,
}) => {
  const { mutate, isPending } = useAddCargo();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<AddCargo>({
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAdd = () => {
    if (!validate(formData, setErrors)) {
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

          queryClient.invalidateQueries({
            queryKey: ["cargos"],
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Добавить груз</DialogTitle>
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
          <div className="flex items-center gap-4">
            {/* Дата заявки */}
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="date">Дата заявки</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal w-full",
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

            {/* Дата погрузки */}
            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="loadUnloadDate">Дата погрузки</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
              className={errors.transportationInfo ? "border-red-500" : ""}
            />
            {errors.transportationInfo && (
              <p className="text-red-500 text-sm">
                {errors.transportationInfo}
              </p>
            )}
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
              className={errors.driver ? "border-red-500" : ""}
            />
            {errors.driver && (
              <p className="text-red-500 text-sm">{errors.driver}</p>
            )}
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
              className={errors.payoutAmount ? "border-red-500" : ""}
            />
            {errors.payoutAmount && (
              <p className="text-red-500 text-sm">{errors.payoutAmount}</p>
            )}
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
                      ? parse(formData.payoutDate, "dd.MM.yyyy", new Date())
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
            {errors.payoutDate && (
              <p className="text-red-500 text-sm">{errors.payoutDate}</p>
            )}
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
              className={errors.paymentStatus ? "border-red-500" : ""}
            />
            {errors.paymentStatus && (
              <p className="text-red-500 text-sm">{errors.paymentStatus}</p>
            )}
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
              className={errors.payoutTerms ? "border-red-500" : ""}
            />
            {errors.payoutTerms && (
              <p className="text-red-500 text-sm">{errors.payoutTerms}</p>
            )}
          </div>
          {/* Выбор машины */}
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
