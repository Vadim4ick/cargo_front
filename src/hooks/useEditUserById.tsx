import { User, usersServices } from "@/services/users.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useEditUserById = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<User> }) =>
      usersServices.patchById({
        id,
        body,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users_all"] });
    },
  });

  return { mutate, isPending };
};

export { useEditUserById };
