import { $apiAuth } from "@/api/api";
import { isAxiosError } from "axios";
import { toast } from "sonner";

class InvitationServices {
  private _Invitation = "/invitation";

  async sendInvitation({ email }: { email: string }) {
    try {
      const { data } = await $apiAuth.post<{
        message: string;
        inviteLink: string;
      }>(`${this._Invitation}/invite`, {
        email,
      });

      toast.success(data.message);
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

export const invitationServices = new InvitationServices();
