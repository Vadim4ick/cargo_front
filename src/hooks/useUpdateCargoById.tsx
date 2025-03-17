import { cargoServices } from "@/services/cargo.service";
import { Cargo } from "@/services/truck.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateCargoById = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<Cargo> }) =>
      cargoServices.updateById({ id, body }),
  });

  return { mutate, isPending };
};

export { useUpdateCargoById };
