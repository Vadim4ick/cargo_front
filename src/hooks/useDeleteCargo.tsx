import { cargoServices } from "@/services/cargo.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useCargoById = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: number }) =>
      cargoServices.deleteById({
        id,
      }),

    onSuccess: () => {
      toast.success("Груз успешно удален");
      queryClient.invalidateQueries({ queryKey: ["cargos"] });
    },
  });

  return { mutate, isPending };
};

export { useCargoById };
