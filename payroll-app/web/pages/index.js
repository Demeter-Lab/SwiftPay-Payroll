import Head from "next/head";
// import { Freelancer } from "@/components/Freelancer";
import { Inter } from "next/font/google";
import { useState } from "react";
import Login from "@/components/Login";
import { SelectWhoToPay } from "@/components/SelectWhoToPay";
import { addWorker } from "@/flow-interactions/transactions";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Payroll Dashboard</title>
        <meta name="description" content="Built by Israel & Mide Sofek" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1> Payroll Dashboard</h1>
      <Login />
      <main className="main">
        <div>
          <SelectWhoToPay />
        </div>
      </main>
    </>
  );
}
