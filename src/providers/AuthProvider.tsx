"use client";

import { Loader } from "@/components/ui/preloader";
import { useGetProfile } from "@/hooks/useGetProfie";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading: isLoadingProfile } = useGetProfile();

  if (isLoadingProfile) {
    return (
      <div className="bg-gray-100 flex flex-col h-full p-6">
        <Loader className="absolute left-1/2 top-1/2 size-10" />
      </div>
    );
  }

  return children;
};

export { AuthProvider };
