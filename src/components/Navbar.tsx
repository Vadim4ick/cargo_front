"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { authServices } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authServices.logout();

    router.push("/login");
  };

  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">🚚</span> Акос
        </Link>

        {/* Навигация */}
        <div className="flex space-x-6 items-center">
          <Link href="/" className="hover:text-blue-300 transition">
            Главная
          </Link>
          <Link href="/users" className="hover:text-blue-300 transition">
            Пользователи
          </Link>

          <Button variant={"secondary"} onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
