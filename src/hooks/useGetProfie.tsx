import { authServices } from "@/services/auth.service";
import { useProfile } from "@/store/profile";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const useGetProfile = () => {
  const { setUser } = useProfile();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authServices.getMe(),
  });

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }
  }, [isSuccess, data, setUser]);

  return {
    data,
    isLoading,
  };
};

export { useGetProfile };
