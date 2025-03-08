"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="flex items-center justify-center p-4 h-full">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">АКОС</h1>
          <p className="text-gray-500">Войдите в систему грузоперевозок</p>
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
              <p className="block text-sm font-medium text-gray-700">Пароль</p>

              <Input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <Button type="submit">Войти</Button>
        </form>
      </div>
    </div>
  );
};
