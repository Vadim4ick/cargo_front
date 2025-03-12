import { truckServices } from "@/services/truck.service";
import { useQuery } from "@tanstack/react-query";

const useGetAllTrucks = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["trucks"],
    queryFn: () => truckServices.getAll(),
  });

  return {
    trucks: data?.data,
    isLoading,
  };
};

export { useGetAllTrucks };
