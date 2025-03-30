import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cargo } from "@/services/truck.service";

interface CargoDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cargo: Cargo | null;
}

export const CargoDetailsModal: React.FC<CargoDetailsModalProps> = ({
  isOpen,
  onClose,
  cargo,
}) => {
  if (!cargo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Детали груза
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Номер груза:</span>
            <span>{cargo.cargoNumber}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Дата заявки:</span>
            <span>{cargo.date}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Дата погрузки/разгрузки:</span>
            <span>{cargo.loadUnloadDate}</span>
          </div>
          <div className="flex flex-col border-b pb-2">
            <span className="font-semibold mb-1">Информация о перевозке:</span>
            <span>{cargo.transportationInfo}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Водитель:</span>
            <span>{cargo.driver}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Сумма выплаты:</span>
            <span>${cargo.payoutAmount}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Дата выплаты:</span>
            <span>{cargo.payoutDate}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Статус оплаты:</span>
            <span>{cargo.paymentStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Условия выплаты:</span>
            <span>{cargo.payoutTerms}</span>
          </div>
          {cargo.truckId && (
            <div className="flex justify-between border-t pt-2 mt-4">
              <span className="font-semibold">ID машины:</span>
              <span>{cargo.truckId}</span>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
