import { $apiAuth } from "@/api/api";
import { Cargo } from "./truck.service";
import { toast } from "sonner";

class CargoServices {
  private _Cargo = "/cargo";

  async updateById({ id, body }: { id: string; body: FormData }) {
    try {
      await $apiAuth.patch<Cargo>(`${this._Cargo}/${id}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      toast.error("Произошла непредвиденная при обновлении груза");
      throw err;
    }
  }

  async addCargo({ body }: { body: FormData }) {
    try {
      return await $apiAuth.post<Cargo>(`${this._Cargo}`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      toast.error("Произошла непредвиденная при добавлении груза");
      throw err;
    }
  }

  async getById({ id }: { id: string }) {
    return await $apiAuth.get<Cargo>(`${this._Cargo}/${id}`);
  }

  async deleteById({ id }: { id: number }) {
    try {
      return await $apiAuth.delete<{ message: string }>(`${this._Cargo}/${id}`);
    } catch (err) {
      toast.error("Произошла непредвиденная при удалении груза");
      throw err;
    }
  }
}

export const cargoServices = new CargoServices();
