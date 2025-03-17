import { $apiAuth } from "@/api/api";

export interface Cargo {
  id: number;
  cargoNumber: string;
  date: string;
  transportationInfo: string;
  payoutAmount: number;
  payoutTerms: string;
  createdAt: string;
  cargoPhoto?: File;
}

export interface Truck {
  id: number;
  name: string;
  cargos: Cargo[];
}

class TruckServices {
  private _Truck = "/truck";

  async getAll() {
    return await $apiAuth.get<Truck[]>(`${this._Truck}`);
  }
}

export const truckServices = new TruckServices();
