import { Cargo } from "@/services/truck.service";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AddCargo = Omit<Cargo, "id" | "createdAt">;

export const validate = (
  formData: AddCargo,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
) => {
  const newErrors: { [key: string]: string } = {};
  if (!formData.cargoNumber.trim()) {
    newErrors.cargoNumber = "Номер груза обязателен";
  }
  if (!formData.date) {
    newErrors.date = "Дата груза обязательна";
  }
  if (!formData.loadUnloadDate) {
    newErrors.loadUnloadDate = "Дата погрузки/разгрузки обязательна";
  }
  if (!formData.transportationInfo.trim()) {
    newErrors.transportationInfo = "Информация о перевозке обязательна";
  }
  if (!formData.driver.trim()) {
    newErrors.driver = "Имя водителя обязательно";
  }

  if (!formData.truckId) {
    newErrors.truckId = "Выберите машину";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
