import { authServices } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useLogin = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authServices.login({ email, password }),
    onSuccess: () => {
      setTimeout(() => {
        router.push("/");
      }, 100);
    },
  });

  return { mutate, isPending };
};

export { useLogin };
