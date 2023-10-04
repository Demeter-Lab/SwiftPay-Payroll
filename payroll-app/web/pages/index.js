import Head from "next/head";
// import { Freelancer } from "@/components/Freelancer";
import { Inter } from "next/font/google";
import { useState } from "react";
import Login from "@/components/Login";
import { addWorker } from "@/flow-interactions/transactions";

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
    const [isSingleFreelancer, setIsSingleFreelancer] = useState(false);

    function handleSingleFreelancer() {
      setIsSingleFreelancer(() => !isSingleFreelancer);
    }
    return (
      <>
        <div className="cards">
          <div onClick={handleSingleFreelancer}>
            {"Single Freelancer Payment "}
          </div>
          <div>{"Batch Freelancer Payment"}</div>
        </div>
        {isSingleFreelancer ? <SingleFreelancer /> : ""}
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

  function SingleFreelancer() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [totalPay, setTotalPay] = useState("");

    // this function calls the addWorker function on the contract
    async function callAddWorker() {
      if ((name && address, totalPay)) {
        await addWorker(name, address, totalPay);
        // if successful alert
        alert("Add Freelancer Successful");
      } else {
        alert("Field cannot be empty");
      }
    }

    async function handleSubmit(e) {
      try {
        e.preventDefault();
        // call the add worker function on flow
        await callAddWorker();
      } catch (err) {
        alert(err.message);
      }
    }

    return (
      <>
        <div>
          <form onSubmit={handleSubmit}>
            <h1>Add Freelancer 👷‍♂️</h1>
            <label>EnterName: </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />

            <label>Address: </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <br />

            <label>Amount: </label>
            <input
              type="number"
              value={totalPay}
              onChange={(e) => setTotalPay(e.target.value)}
            />

            <button>Add</button>
          </form>
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
