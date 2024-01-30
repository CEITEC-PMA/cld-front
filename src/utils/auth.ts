import { signIn } from "next-auth/react";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiUrl } from "@/utils/api";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        inep: { label: "inep", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        const response = await fetch(`${apiUrl}/usuarios/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inep: credentials?.inep,
            password: credentials?.password,
          }),
        });
        const user = await response.json();

        console.log(user.usuario);

        if (user && response.ok) {
          return user.usuario;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
};
