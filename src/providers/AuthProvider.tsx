"use client";

import { Loader } from "@/components/ui/preloader";
import { useGetProfile } from "@/hooks/useGetProfie";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading: isLoadingProfile } = useGetProfile();

  if (isLoadingProfile) {
    return (
      <div className="bg-gray-100 flex flex-col items-center justify-center p-6 fixed size-10 z-[5000] w-full h-full">
        <Loader />
      </div>
    );
  }

  return children;
};

export { AuthProvider };
