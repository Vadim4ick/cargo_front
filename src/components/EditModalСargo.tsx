import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // проверьте путь импорта
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Cargo } from "@/services/truck.service";
import { useUpdateCargoById } from "@/hooks/useUpdateCargoById";
import { toast } from "sonner";

interface EditModalProps {
  cargo: Cargo;
}

export const EditModalСargo = ({ cargo }: EditModalProps) => {
  const [formData, setFormData] = useState<Cargo>(cargo);

  const { mutate, isPending } = useUpdateCargoById();

  const handleSave = () => {
    const formDate = new FormData();

    formDate.append("cargoNumber", formData.cargoNumber);
    formDate.append("date", new Date(formData.date).toISOString());
    // formDate.append("weight", formData.cargoPhoto);
    formDate.append("payoutAmount", String(formData.payoutAmount));
    formDate.append("payoutTerms", formData.payoutTerms);
    formDate.append("transportationInfo", formData.transportationInfo);
    formDate.append("truckId", formData.truckId.toString());

    mutate(
      {
        id: cargo.id.toString(),
        body: formDate,
      },
      {
        onSuccess: () => {
          toast.success("Груз успешно обновлен");
        },
      }
    );
  };

  useEffect(() => {
    setFormData(cargo);
  }, [cargo]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Редактировать</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать груз</DialogTitle>
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
            />
          </div>
          <div>
            <Label htmlFor="date">Дата</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
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
            />
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
            />
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
            />
          </div>
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
