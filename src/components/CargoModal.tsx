/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
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
import { AddCargo, cn, validate } from "@/lib/utils";
import { format } from "date-fns";
import { useAddCargo } from "@/hooks/useAddCargo";
import { useUpdateCargoById } from "@/hooks/useUpdateCargoById";
import { useQueryClient } from "@tanstack/react-query";

interface CargoModalProps {
  isOpen: boolean;
  onClose: () => void;
  trucks?: Truck[];
  cargo?: Cargo; // Если cargo передан – это режим редактирования
}

//
// Предположим, что в интерфейсе Cargo поля date, loadUnloadDate, payoutDate уже Date
// (или как минимум Cargo["date"] всегда приходят как объект Date от запроса).
//

const CargoModal: React.FC<CargoModalProps> = ({
  isOpen,
  onClose,
  trucks,
  cargo,
}) => {
  // Режим редактирования?
  const isEditMode = Boolean(cargo);

  // Состояние для файлов
  const [files, setFiles] = useState<File[]>([]);
  // Реф для скрытого input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Функция для удаления файла из списка
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Начальное состояние для формы
  const [formData, setFormData] = useState<AddCargo>({
    cargoNumber: "",
    date: undefined,
    loadUnloadDate: undefined,
    transportationInfo: "",
    driver: "",
    payoutAmount: 0,
    payoutDate: undefined,
    paymentStatus: "",
    payoutTerms: "",
    truckId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Функция для обработки выбора файлов
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...filesArray]);
    }
  };

  useEffect(() => {
    if (cargo) {
      // Если в cargo поля уже Date, просто берём их
      setFormData({
        cargoNumber: cargo.cargoNumber,
        date: cargo.date ?? undefined,
        loadUnloadDate: cargo.loadUnloadDate ?? undefined,
        transportationInfo: cargo.transportationInfo,
        driver: cargo.driver,
        payoutAmount: cargo.payoutAmount,
        payoutDate: cargo.payoutDate ?? undefined,
        paymentStatus: cargo.paymentStatus,
        payoutTerms: cargo.payoutTerms,
        truckId: cargo.truckId, // приводим к строке, если нужно
      });
    } else {
      // Если нет cargo, сбрасываем все поля в дефолт
      setFormData({
        cargoNumber: "",
        date: undefined,
        loadUnloadDate: undefined,
        transportationInfo: "",
        driver: "",
        payoutAmount: 0,
        payoutDate: undefined,
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

    // Подготавливаем данные для отправки.
    // Вы используете FormData, значит нужно превратить Date -> строка (ISO или ваш формат).
    const formDate = new FormData();
    formDate.append("cargoNumber", formData.cargoNumber);
    // Если нужна ISO-строка:
    formDate.append(
      "date",
      formData.date ? new Date(formData.date).toISOString() : ""
    );
    formDate.append(
      "loadUnloadDate",
      formData.loadUnloadDate
        ? new Date(formData.loadUnloadDate).toISOString()
        : ""
    );
    formDate.append("transportationInfo", formData.transportationInfo);
    formDate.append("driver", formData.driver);
    if (formData.payoutAmount)
      formDate.append("payoutAmount", String(formData.payoutAmount));
    if (formData.payoutDate)
      formDate.append(
        "payoutDate",
        formData.payoutDate ? new Date(formData.payoutDate).toISOString() : ""
      );
    if (formData.paymentStatus)
      formDate.append("paymentStatus", formData.paymentStatus);
    if (formData.payoutTerms)
      formDate.append("payoutTerms", formData.payoutTerms);
    formDate.append("truckId", formData.truckId);

    if (isEditMode) {
      updateMutation.mutate(
        {
          id: String(cargo!.id),
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
        { body: formDate },
        {
          onSuccess: () => {
            toast.success("Груз успешно добавлен");
            // Сброс формы
            setFormData({
              cargoNumber: "",
              date: undefined,
              loadUnloadDate: undefined,
              transportationInfo: "",
              driver: "",
              payoutAmount: 0,
              payoutDate: undefined,
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
      <DialogContent className="sm:max-w-[650px] overflow-auto h-[600px]">
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

          {/* Дата заявки */}
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
                    {formData.date
                      ? format(formData.date, "dd.MM.yyyy")
                      : "Выберите дату"}
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
                    selected={new Date(formData.date!) ?? new Date()}
                    onSelect={(day: Date | undefined) => {
                      if (!day) return;
                      setFormData({ ...formData, date: day });
                    }}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>

            {/* Дата погрузки/разгрузки */}
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
                    {formData.loadUnloadDate
                      ? format(formData.loadUnloadDate, "dd.MM.yyyy")
                      : "Выберите дату"}
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
                    selected={new Date(formData.loadUnloadDate!) ?? new Date()}
                    onSelect={(day: Date | undefined) => {
                      if (!day) return;
                      setFormData({ ...formData, loadUnloadDate: day });
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

          <div className="flex items-center gap-4">
            {/* Водитель */}
            <div className="flex flex-col gap-1 w-full">
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
            <div className="flex flex-col gap-1 w-full">
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
          </div>

          <div className="flex items-center gap-4">
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
                    {formData.payoutDate
                      ? format(formData.payoutDate, "dd.MM.yyyy")
                      : "Выберите дату"}
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
                    selected={formData.payoutDate ?? new Date()}
                    onSelect={(day: Date | undefined) => {
                      if (!day) return;
                      setFormData({ ...formData, payoutDate: day });
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Статус оплаты */}
            <div className="flex flex-col gap-1 w-full">
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

          <div className="flex items-center gap-4">
            {trucks && (
              <div className="w-full">
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
                      <SelectItem key={truck.id} value={String(truck.id)}>
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

            <div className="flex flex-col gap-1 w-full">
              <Label htmlFor="files">
                Прикрепить файлы (png, jpg, pdf, Excel)
              </Label>
              {/* Кнопка для открытия диалога выбора файлов */}
              <Button onClick={() => fileInputRef.current?.click()}>
                Загрузить файлы
              </Button>
              {/* Скрытый input для файлов */}
              <input
                id="files"
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                multiple
                accept="image/png, image/jpeg, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFilesChange}
              />
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 font-semibold">
                Предпросмотр загруженных файлов:
              </p>
              <div className="flex flex-wrap gap-4">
                {files.map((file, index) => {
                  const isImage = file.type.startsWith("image/");
                  return (
                    <div
                      key={index}
                      className="rounded relative"
                      style={{ width: 120, height: 120 }}
                    >
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-center text-sm">
                          {file.name}
                        </div>
                      )}
                      <Button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute flex top-1 bg-red-500 text-[12px] right-1 size-[16px] p-0 flex-1"
                      >
                        ✕
                      </Button>
                    </div>
                  );
                })}
              </div>
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
