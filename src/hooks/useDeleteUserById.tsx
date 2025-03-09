import { usersServices } from "@/services/users.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteUserById = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      usersServices.deleteById({
        id,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users_all"] });
    },
  });

  return { mutate, isPending };
};

export { useDeleteUserById };
