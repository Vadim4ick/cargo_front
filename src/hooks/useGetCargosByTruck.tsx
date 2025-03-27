import { truckServices } from "@/services/truck.service";
import { useQuery } from "@tanstack/react-query";

type UseGetCargosByTruckProps = {
  id: string;
  page: number;
  limit: number;
};

export const useGetCargosByTruck = ({
  id,
  page,
  limit,
}: UseGetCargosByTruckProps) => {
  return useQuery({
    queryKey: ["cargos", id, page, limit],
    queryFn: () => truckServices.getAllCargosByTruck({ id, page, limit }),
    enabled: !!id,
  });
};
