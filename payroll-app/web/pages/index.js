import Head from "next/head";
// import { Freelancer } from "@/components/Freelancer";
import { Inter } from "next/font/google";
import { useState } from "react";
import Login from "@/components/Login";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  function SelectWhoToPay() {
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [isEmployer, setIsEmployer] = useState(false);

    function handleFreelancer() {
      setIsEmployer(false);
      setIsFreelancer(() => !isFreelancer);
    }

    function handleEmployer() {
      setIsFreelancer(false);
      setIsEmployer(() => !isEmployer);
    }
    return (
      <>
        <div className="cards">
          <div onClick={handleFreelancer}>
            <span>Freelancer</span>
          </div>
          <div onClick={handleEmployer}>
            <span>Employer</span>
          </div>
        </div>
        {isFreelancer ? <Freelancer /> : ""}
        {isEmployer ? <Employer /> : ""}
      </>
    );
  }

  function Freelancer() {
    console.log("Hello From Freelancer");
    return (
      <>
        <div className="cards">
          <div>{"Single Freelancer Payment "}</div>
          <div>{"Batch Freelancer Payment"}</div>
        </div>
      </>
    );
  }

  function Employer() {
    console.log("Hello From Employer");
    return (
      <>
        <div className="cards">
          <div>{"Single Employer Payment"}</div>
          <div>{"Batch Employer Payment"}</div>
        </div>
      </>
    );
  }

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
