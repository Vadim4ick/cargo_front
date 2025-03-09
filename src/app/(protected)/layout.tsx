import { AuthProvider } from "@/providers/AuthProvider";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ProtectedLayout;
