'use client'

import { cache, useLayoutEffect, useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Trash2 } from "lucide-react";
import { logout } from "../api/auth/logout";



async function getData() {
  const res = await fetch('http://localhost:3000/api/admin', {cache: 'no-store'},);
  return res.json();
}
async function PostData(User: any) {
  const res = await fetch('http://localhost:3000/api/admin/AddRight', {
    method: 'POST',
    body: JSON.stringify(User)
  });
  
  return res.json()
}


async function DeleteUser(User: any) {
  const res = await fetch('http://localhost:3000/api/admin/deleteUser', {
    method: 'POST',
    body: JSON.stringify(User)
  });
  return res.json()
}


const data = await getData();



export default function Admin() {
  const [Users, setItems] = useState([])
  useLayoutEffect(() => {
      setItems(data.data)
    }, []);
  const { toast } = useToast();
  const addAdmin = (User:any) => {
    toast({
      title: "Успешно!",
      description: `Пользователь ${User.Name} назначен администратором.`,
    });
  }
  const removeUser = (user: any) => {
    setItems(Users.filter((User: any) => User.id !== user.id));
    toast({
      title: "Успешно!",
      description: `Пользователь ${user.Name} удален.`,
    });
  };

  return (
    <div className="container mx-auto py-8 pt-[150]">
      <h2 className="inline text-3xl font-bold mb-8 mr-8">Список пользователей</h2>
      <button onClick={logout} className="mb-8 text-[#C34D3F]">Выйти из аккаунта</button>
      <div className="space-y-6">
        {
          Users.map((User: any) => (
            <div suppressHydrationWarning 
              key={User.id}
              className="flex items-center justify-between border rounded-lg p-4 shadow-sm">
              <div suppressHydrationWarning className="flex items-center space-x-4">
                <div>
                  <h3 suppressHydrationWarning  className="font-bold">{User.Name}</h3>
                  <p suppressHydrationWarning  className="text-gray-600">{User.Email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => { removeUser(User), DeleteUser(User)}}><Trash2 className="w-4 h-4" /></button>
                <button onClick={() => { PostData(User), addAdmin(User)}}>Сделать администратором</button>
              </div>
            </div>

          ))}
      </div>
    </div>
  )
};