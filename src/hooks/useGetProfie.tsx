import { authServices } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

const useGetProfile = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authServices.getMe(),
  });

  return {
    data,
    isLoading,
  };
};

export { useGetProfile };
