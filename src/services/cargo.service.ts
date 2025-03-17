import { $apiAuth } from "@/api/api";
import { Cargo } from "./truck.service";

class CargoServices {
  private _Cargo = "/cargo";

  async updateById({ id, body }: { id: string; body: Partial<Cargo> }) {
    return await $apiAuth.patch<Cargo>(
      `${this._Cargo}/${id}`,
      {
        ...body,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  async getById({ id }: { id: string }) {
    return await $apiAuth.get<Cargo>(`${this._Cargo}/${id}`);
  }
}

export const cargoServices = new CargoServices();
