
'use client';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { logout } from '../api/auth/logout';
import { deleteAccount } from '../api/auth/deleteUser';
import { useToast } from '../hooks/use-toast';
import { DeleteUser, getData, getOrder, UpdateUser } from './userServer';


const Account: React.FC = () => {
    const [userData, setUserData] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getData();
                const orderData = await getOrder();
                setUserData(user.data);
                setOrders(orderData.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const submitHandler = async (e: BaseSyntheticEvent<Event, EventTarget & HTMLFormElement>) => {
        e.preventDefault();
        const values = Object.fromEntries(new FormData(e.target));
        const newUserData = {
            id: userData.id,
            Name: values.name,
            Email: values.email,
            Phone: values.phone,
        };

        try {
            await UpdateUser(newUserData);
            toast({
                title: "Данные изменены!",
                description: "Вы успешно изменили данные аккаунта.",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await DeleteUser({ id: userData.id });
            await deleteAccount();
            toast({
                title: "Аккаунт удален!",
                description: "Ваш аккаунт был успешно удален.",
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (!userData) return <p className='absolute flex justify-center items-center w-screen h-screen'>Загрузка...</p>;

    return (
        <>
            <div className="flex flex-col">
                <form onSubmit={submitHandler}>
                    <div className="flex pt-[129px] pl-[22px]">
                        <div className="flex justify-center items-center gap-[42px] w-[764px] h-[252px] font-light bg-[url('/images/user_back.svg')]">
                            <Image src="./images/user_account.svg" width={152} height={137} alt="" />
                            <div className="flex flex-col gap-[21px]">
                                <input
                                    id="name"
                                    name="name"
                                    className="pl-12 flex bg-[#2D3538] focus:outline-none justify-center ml-[48px] items-center w-[340.5px] h-[38px] bg-[url('/images/user_form_back.svg')] font-body text-white"
                                    type="text"
                                    defaultValue={userData.Name}
                                />
                                <input
                                    id="email"
                                    name="email"
                                    className="pl-12 flex bg-[#2D3538] focus:outline-none justify-center ml-[22px] items-center w-[340.5px] h-[38px] bg-[url('/images/user_form_back.svg')] font-body text-white"
                                    type="text"
                                    defaultValue={userData.Email}
                                />
                                <input
                                    id="phone"
                                    name="phone"
                                    className="pl-12 flex bg-[#2D3538] focus:outline-none justify-center items-center w-[340.5px] h-[38px] bg-[url('/images/user_form_back.svg')] font-body text-white"
                                    type="text"
                                    defaultValue={userData.Phone}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[36px]">
                            <button
                                type="submit"
                                className="w-[330px] h-[60px] ml-[60px] bg-[url('/images/user_btn_back.svg')] text-white font-body font-bold transition-all hover:bg-[url('/images/user_btn_back1.svg')] hover:text-black"
                            >
                                Изменить данные
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteUser}
                                className="w-[330px] h-[60px] ml-[30px] bg-[url('/images/user_btn_back.svg')] text-white font-body font-bold transition-all hover:bg-[url('/images/user_btn_back1.svg')] hover:text-black"
                            >
                                Удалить аккаунт
                            </button>
                            <button
                                type="button"
                                onClick={logout}
                                className="w-[330px] h-[60px] bg-[url('/images/user_btn_back.svg')] text-white font-body font-bold transition-all hover:bg-[url('/images/user_btn_back1.svg')] hover:text-black"
                            >
                                Выход
                            </button>
                        </div>
                    </div>
                </form>
                <div className="pt-[30px] pl-[22px]">
                    <div className="flex justify-center items-center w-[667px] h-[60px] text-2xl font-body font-bold text-white bg-[url('/images/user_product_back.svg')]">
                        <p>Мои заказы</p>
                    </div>
                    <div className="mt-[20px] w-[644px] p-2 border border-[#C34D3F]">
                        {orders.length === 0 ? (
                            <p className="text-center text-gray-600">Нет заказов</p>
                        ) : (
                            <div suppressHydrationWarning className="space-y-6">
                                {orders.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between border border-[#C34D3F] rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center space-x-4">
                                            <img src={item.Image} alt={item.Name} className="w-20 h-20 object-cover rounded" />
                                            <div suppressHydrationWarning>
                                                <h3 className="font-bold">{item.Name}</h3>
                                                <p suppressHydrationWarning className="text-gray-400">{item.Price} ₽</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;