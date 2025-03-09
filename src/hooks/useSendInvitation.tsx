import { invitationServices } from "@/services/invitation.service";
import { useMutation } from "@tanstack/react-query";

const useSendInvitation = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ email }: { email: string }) =>
      invitationServices.sendInvitation({ email }),
  });

  return { mutate, isPending };
};

export { useSendInvitation };
