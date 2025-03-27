import { $apiAuth } from "@/api/api";

export interface Cargo {
  id: number;
  cargoNumber: string;
  date: string;
  transportationInfo: string;
  payoutAmount: number;
  payoutTerms: string;
  createdAt: string;
  truckId: string;
  cargoPhoto?: File;
}

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
    return await $apiAuth.get<Truck[]>(`${this._Truck}`);
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
    return await $apiAuth.get<TruckCargos>(`${this._Truck}/${id}/cargos`, {
      params: { page, limit },
    });
  }
}

export const truckServices = new TruckServices();
