import { $apiAuth } from "@/api/api";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

class UsersServices {
  private _Users = "/users";

  async getAll() {
    const data = await $apiAuth.get<User[]>(`${this._Users}`);

    return data;
  }

  async patchById({ id, body }: { id: number; body: Partial<User> }) {
    try {
      const data = await $apiAuth.patch<{ data: User; message: string }>(
        `${this._Users}/${id}`,
        {
          ...body,
        }
      );

      toast.success(data?.data?.message);

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(
          (error.response.data as { message?: string })?.message ||
            "Ошибка запроса"
        );
      }
    }
  }

  async deleteById({ id }: { id: number }) {
    try {
      const data = await $apiAuth.delete<{ data: User; message: string }>(
        `${this._Users}/${id}`
      );

      toast.success(data?.data?.message);

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(
          (error.response.data as { message?: string })?.message ||
            "Ошибка запроса"
        );
      }
    }
  }
}

export const usersServices = new UsersServices();
