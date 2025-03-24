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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAddCargo } from "@/hooks/useAddCargo";
import { toast } from "sonner";

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

  const handleAdd = () => {
    const formDate = new FormData();

    formDate.append("cargoNumber", formData.cargoNumber?.toString() || "");
    formDate.append("date", new Date(formData.date).toISOString());
    formDate.append("transportationInfo", formData.transportationInfo);
    formDate.append("payoutAmount", String(formData.payoutAmount));
    formDate.append("payoutTerms", formData.payoutTerms);
    formDate.append("truckId", formData.truckId.toString());

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
                setFormData({ ...formData, transportationInfo: e.target.value })
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
