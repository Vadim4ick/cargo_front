import { User } from "@/services/users.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { useState } from "react";
import { useEditUserById } from "@/hooks/useEditUserById";

const EditUsersModal = ({
  open,
  setOpen,
  user,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
}) => {
  const [name, setName] = useState(user?.username);
  const [role, setRole] = useState(user?.role);

  const { mutate, isPending } = useEditUserById();

  const handleSave = async () => {
    mutate(
      {
        id: user.id,
        body: {
          ...user,
          username: name,
          role: role,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирование пользователя</DialogTitle>
          <DialogDescription>
            Измените данные пользователя и нажмите Сохранить.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium">Имя</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Роль
            </label>

            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem disabled value="SUPERADMIN">
                  Суперадмин
                </SelectItem>
                <SelectItem value="EDITOR">Редактор</SelectItem>
                <SelectItem value="USER">Пользователь</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isPending}
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Отмена
          </Button>
          <Button disabled={isPending} onClick={handleSave}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { EditUsersModal };
