"use client";
import React, { Dispatch, SetStateAction, useContext, useState } from "react";

type User = {
  _id: string;
  nome: string;
  role?: string;
  acesso?: number;
  token?: string;
};

type UserContextType = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
};

const UserContext = React.createContext<UserContextType>({
  user: { nome: "", _id: "" },
  setUser: () => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState({} as User);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
