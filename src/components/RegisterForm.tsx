"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { authServices } from "@/services/auth.service";
import { notFound, useRouter, useSearchParams } from "next/navigation";

export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await authServices.register({
      email,
      password,
      username,
      inviteToken: searchParams.get("token") || "",
    });

    if (data?.user) {
      router.push("/login");
      setEmail("");
      setUsername("");
      setPassword("");
    }
  };

  if (!token) return notFound();

  return (
    <div className="flex items-center justify-center p-4 h-full">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">АКОС</h1>
          <p className="text-gray-500">Форма регистрации</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <p className="block text-sm font-medium text-gray-700">
                Электронная почта
              </p>

              <Input
                type="email"
                placeholder="example@freight.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2">
              <p className="block text-sm font-medium text-gray-700">ФИО</p>

              <Input
                type="text"
                placeholder="Иванов Иван Иванович"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="flex flex-col gap-2">
              <p className="block text-sm font-medium text-gray-700">Пароль</p>

              <Input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <Button type="submit">Зарегистрироваться</Button>
        </form>
      </div>
    </div>
  );
};
