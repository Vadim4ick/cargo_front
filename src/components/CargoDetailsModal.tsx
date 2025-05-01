/* eslint-disable @next/next/no-img-element */
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
import { useCargoById } from "@/hooks/useDeleteCargo";
import { useProfile } from "@/store/profile";
import { Download } from "lucide-react";

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
  const { mutate, isPending } = useCargoById();

  const { user: profile } = useProfile();

  if (!cargo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] md:h-[700px] overflow-y-auto p-6">
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
          {cargo.date && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Дата заявки:</span>
              <span>{new Date(cargo.date).toLocaleDateString()}</span>
            </div>
          )}
          {cargo.loadUnloadDate && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Дата погрузки/разгрузки:</span>
              <span>{new Date(cargo.loadUnloadDate).toLocaleDateString()}</span>
            </div>
          )}
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
          {cargo.payoutDate && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Дата выплаты:</span>
              <span>{new Date(cargo.payoutDate).toLocaleDateString()}</span>
            </div>
          )}
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
        {cargo?.cargoPhotos && cargo.cargoPhotos?.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 font-semibold">Загруженные файлы:</p>
            <div className="flex flex-wrap gap-4">
              {cargo.cargoPhotos
                .filter((file) => file.type === "stored")
                ?.map((file, index) => {
                  const isImage = /\.(png|jpe?g|gif|webp|bmp)$/i.test(file.url);

                  return (
                    <div
                      key={index}
                      className="rounded relative group"
                      style={{ width: 120, height: 120 }}
                    >
                      {isImage ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${file.url}`}
                          alt="Фото груза"
                          className="object-cover w-full h-full rounded"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded">
                          <span className="text-gray-500">Файл</span>
                        </div>
                      )}
                      {/* Контейнер для иконки скачивания */}
                      <a
                        href={`${process.env.NEXT_PUBLIC_SERVER_URL}/${file.url}`}
                        download
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded"
                        title="Скачать файл"
                      >
                        <Download className="text-white text-2xl" />
                      </a>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        <DialogFooter className="mt-6">
          {profile?.role !== "USER" && (
            <DialogClose
              onClick={() =>
                mutate(
                  {
                    id: cargo.id,
                  },
                  {
                    onSuccess: () => {
                      onClose();
                    },
                  }
                )
              }
              disabled={isPending}
              asChild
            >
              <Button variant="destructive" onClick={onClose}>
                Удалить
              </Button>
            </DialogClose>
          )}

          <DialogClose disabled={isPending} asChild>
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
