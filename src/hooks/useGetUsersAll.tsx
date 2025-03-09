import { usersServices } from "@/services/users.service";
import { useQuery } from "@tanstack/react-query";

const useGetUsersAll = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users_all"],
    queryFn: () => usersServices.getAll(),
  });

  return {
    data,
    isLoading,
  };
};

export { useGetUsersAll };
