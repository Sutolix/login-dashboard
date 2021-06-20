import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from 'nookies'
import Router from 'next/router'

import { api } from "../services/api";

type User = {
  name: string;
  email: string;
  avatar_url: string;
}

type SignInData = {
  email: string;
  password: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      console.log('query for the current user will be make here')
    }
  }, [])

  async function signIn({ email, password }: SignInData) {

    try {
      await api.get('/login', {
        auth: {
          username: email,
          password
        }
      })
      .then((response) => {
        let token = response.data.token
        setCookie(undefined, 'nextauth.token', token, {
          maxAge: 60 * 60 * 1, // 1 hour
        })
    
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
    
        setUser(user)
    
        Router.push('/dashboard');
      })
      .catch((error) => {
        console.log(error);
      })
      
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}