"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useGetUsersAll } from "@/hooks/useGetUsersAll";
import { Loader } from "@/components/ui/preloader";
import { User } from "@/services/users.service";
import { EditUsersModal } from "@/components/EditUsersModal";
import { useDeleteUserById } from "@/hooks/useDeleteUserById";
import { useProfile } from "@/store/profile";
import { useSendInvitation } from "@/hooks/useSendInvitation";

const UsersPage = () => {
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { user: profile } = useProfile();

  const openEditModal = (user: User) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const { data: users, isLoading } = useGetUsersAll();
  const { mutate } = useDeleteUserById();
  const { mutate: sendInvitation, isPending } = useSendInvitation();

  const handleAddUser = async () => {
    // await invitationServices.sendInvitation({ email: newUserEmail });
    sendInvitation(
      { email: newUserEmail },
      {
        onSuccess: () => {
          setNewUserEmail("");
        },
      }
    );
  };

  const handleDeleteUser = (id: number) => {
    mutate({ id: id });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 flex flex-col h-full p-6">
        <Loader className="absolute left-1/2 top-1/2 size-10" />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex flex-col h-full p-6">
      <section className="py-12 bg-white h-full rounded-lg shadow">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Список пользователей
          </h2>
          <div className="mb-4 flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Добавить пользователя</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить пользователя</DialogTitle>
                  <DialogDescription>
                    Введите email пользователя и выберите его роль. Приглашение
                    будет отправлено на указанный email.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button disabled={isPending} onClick={handleAddUser}>
                    Добавить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left">Имя</th>
                  <th className="px-6 py-3 border-b text-left">Email</th>
                  <th className="px-6 py-3 border-b text-left">Роль</th>
                  <th className="px-6 py-3 border-b w-[100px]"></th>
                  <th className="px-6 py-3 border-b w-[100px]"></th>
                </tr>
              </thead>
              <tbody>
                {users?.data &&
                  users.data.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 border-b">{user.username}</td>
                      <td className="px-6 py-4 border-b">{user.email}</td>
                      <td className="px-6 py-4 border-b">{user.role}</td>
                      <td className="px-6 py-4 border-b">
                        <Button
                          disabled={user.id === profile?.id}
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Удалить
                        </Button>
                      </td>
                      <td className="px-6 py-4 border-b">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            openEditModal(user);
                            setIsEditModalOpen(true);
                          }}
                        >
                          Редактировать
                        </Button>
                      </td>
                    </tr>
                  ))}
                {users?.data.length === 0 && (
                  <tr>
                    <td className="px-6 py-4 border-b text-center" colSpan={5}>
                      Нет пользователей
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {currentUser && (
        <EditUsersModal
          open={isEditModalOpen}
          user={currentUser}
          setOpen={setIsEditModalOpen}
        />
      )}
    </div>
  );
};

export default UsersPage;
