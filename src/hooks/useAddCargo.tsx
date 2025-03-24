import { cargoServices } from "@/services/cargo.service";
import { useMutation } from "@tanstack/react-query";

const useAddCargo = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ body }: { body: FormData }) =>
      cargoServices.addCargo({ body }),
  });

  return { mutate, isPending };
};

export { useAddCargo };
