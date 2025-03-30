"use client";

import React, { useEffect, useState } from "react";
import { useGetAllTrucks } from "@/hooks/useGetAllTrucks";
import { Button } from "@/components/ui/button";
import { MainTable } from "@/components/MainTable";
import { CargoModal } from "@/components/CargoModal";

// async function urlToFile(
//   url: string,
//   fileName: string,
//   mimeType: string
// ): Promise<File> {
//   const response = await fetch(url);
//   const blob = await response.blob();
//   return new File([blob], fileName, { type: mimeType });
// }

export default function Home() {
  const { trucks } = useGetAllTrucks();
  const [addModalOpen, setAddModalOpen] = useState(false);
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // console.log(selectedImage);

  // const { data: cargo, isLoading: cargoLoading } = useGetCargoById({
  //   id: "564085b6-71eb-47fa-86d7-07aa5a87f3ae",
  // });
  // const { mutate } = useUpdateCargoById();

  // console.log(cargo);

  // const onClick = () => {
  //   if (!selectedImage) return;

  //   mutate({
  //     id: "564085b6-71eb-47fa-86d7-07aa5a87f3ae",
  //     body: {
  //       cargoPhoto: selectedImage,
  //     },
  //   });
  // };

  // Состояние для выбранного таба (грузовика)
  const [activeTruckIndex, setActiveTruckIndex] = useState<number>(0);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    // при смене активной машины — сброс на первую страницу
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [activeTruckIndex]);

  return (
    <div className="bg-gray-100 flex flex-col h-full">
      <section className="py-12 bg-white h-full">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Данные о перевозках
          </h2>

          {/* <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Загрузка изображения</h2>
            <ImageUploader
              defaultImage={`http://localhost:3000/${cargo?.cargoPhoto?.url}`}
              onChange={setSelectedImage}
            />
            {selectedImage && (
              <p className="mt-2 text-sm">
                Выбранный файл: {selectedImage.name}
              </p>
            )}

            <button onClick={onClick}>Загрузить</button>
          </div> */}

          <div className="flex items-end justify-end">
            <Button
              onClick={() => setAddModalOpen(true)}
              className="w-full mb-4 max-w-[200px]"
            >
              Добавить груз
            </Button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col justify-between">
            {/* Навигация табов */}
            <div className="mb-4 border-b border-gray-200">
              <nav className="flex space-x-4 overflow-auto">
                {trucks?.map((truck, index) => (
                  <button
                    key={truck.id}
                    onClick={() => setActiveTruckIndex(index)}
                    className={`py-2 px-4 font-medium text-sm focus:outline-none whitespace-nowrap ${
                      activeTruckIndex === index
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {truck.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Таблица */}
            {trucks?.[activeTruckIndex]?.id && (
              <MainTable
                truckId={trucks?.[activeTruckIndex]?.id}
                pagination={pagination}
                setPagination={setPagination}
              />
            )}
          </div>
        </div>
      </section>

      <CargoModal
        isOpen={addModalOpen}
        trucks={trucks}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
