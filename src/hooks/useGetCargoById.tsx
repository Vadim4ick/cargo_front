import { cargoServices } from "@/services/cargo.service";
import { useQuery } from "@tanstack/react-query";

const useGetCargoById = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: [`cargo_${id}`],
    queryFn: () => cargoServices.getById({ id }),
  });

  return {
    data: data?.data,
    isLoading,
  };
};

export { useGetCargoById };
