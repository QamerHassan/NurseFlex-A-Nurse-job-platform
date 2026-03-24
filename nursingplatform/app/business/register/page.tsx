import React from 'react';
import { getServerSession } from "next-auth/next";
import RegisterForm from './RegisterForm';

export default async function BusinessRegister() {
  const session = await getServerSession();
  return <RegisterForm initialSession={session} />;
}
