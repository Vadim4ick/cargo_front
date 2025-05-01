import { $apiAuth } from "@/api/api";

export interface Cargo {
  id: number;
  date?: Date;
  cargoNumber: string;
  loadUnloadDate?: Date;
  transportationInfo: string;
  driver: string;
  payoutAmount: number;
  payoutDate?: Date;
  createdAt: string;
  paymentStatus: string;
  payoutTerms: string;
  truckId: string;
  cargoPhotos?: CargoPhotoUnion[];
}

export interface CargoPhotoStored {
  id: string;
  url: string;
  type: "stored";
}
export interface CargoPhotoNew {
  file: File;
  preview: string;
  type: "new";
}
type CargoPhotoUnion = CargoPhotoStored | CargoPhotoNew;

export interface Truck {
  id: string;
  name: string;
}

export interface TruckCargos {
  total: number;
  page: number;
  data: Cargo[];
}

class TruckServices {
  private _Truck = "/truck";

  async getAll() {
    return await $apiAuth.get<{ data: Truck[] }>(`${this._Truck}`);
  }

  async getAllCargosByTruck({
    id,
    page,
    limit,
  }: {
    id: string;
    page: number;
    limit: number;
  }) {
    return await $apiAuth
      .get<TruckCargos>(`${this._Truck}/${id}/cargos`, {
        params: { page, limit },
      })
      .then((res) => res.data);
  }
}

export const truckServices = new TruckServices();
