import * as fcl from "@onflow/fcl";
import { useCallback, useState } from "react";
import {
  addWorker,
  payWorker,
  payInBatch,
} from "@/flow-interactions/transactions";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

import { viewAllWorkers } from "@/flow-interactions/scripts";

export function SelectWhoToPay() {
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

  function Freelancer() {
    console.log("Hello From Freelancer");
    const [isSingleFreelancer, setIsSingleFreelancer] = useState(false);
    const [isBatchFreelancer, setIsBatchFreelancer] = useState(false);

    function handleSingleFreelancer() {
      setIsSingleFreelancer(() => !isSingleFreelancer);
      setIsBatchFreelancer(false);
    }

    function handleBatchFreelancer() {
      setIsBatchFreelancer(() => !isBatchFreelancer);
      setIsSingleFreelancer(false);
    }

    return (
      <>
        <div className="cards">
          <div onClick={handleSingleFreelancer}>
            {"Single Freelancer Payment "}
          </div>
          <div onClick={handleBatchFreelancer}>
            {"Batch Freelancer Payment"}
          </div>
        </div>
        {isSingleFreelancer ? <SingleFreelancer /> : ""}
        {isBatchFreelancer ? <BatchFreelancer /> : ""}
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
      try {
        if ((name && address, totalPay)) {
          const addTxId = await addWorker(name, address, totalPay);
          await fcl.tx(addTxId).onceSealed();
          // if successful alert
          alert("Add Freelancer Successful");

          const payTxId = await payWorker(totalPay, address);
          console.log("Sending....");
          await fcl.tx(payTxId).onceSealed();
          alert("Freelancer Paid Successful💰");
        } else {
          alert("Field cannot be empty");
        }
      } catch (err) {
        err.message;
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

            <button>Pay</button>
          </form>
        </div>
      </>
    );
  }

  function BatchFreelancer() {
    // state to keep track of the CSV data
    const [parsedCsvData, setParsedCsvData] = useState([]);

    // this function parses our file data from CSV to JSON
    const parseFile = (file) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setParsedCsvData(results.data);
        },
      });
    };

    // function that is called when a file is added to the dropzone
    const onDrop = useCallback(async (acceptedFiles) => {
      if (acceptedFiles.length) {
        parseFile(acceptedFiles[0]);
      }
    }, []);

    // react-dropzone configuration
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
    } = useDropzone({ onDrop, accept: "text/csv" });

    // add workers in batch handler
    async function callPayInBatch() {
      try {
        if (parsedCsvData.length < 1)
          return alert("Empty File Can't be processed");
        console.log(parsedCsvData);
        console.log(parsedCsvData[0]);

        const workerList = parsedCsvData.map((worker) => {
          const workerAddress = worker.walletAddress;
          const workerPay = worker.totalPay;
          const workerName = `"${worker.name}"`;

          return `SwiftPayV3.Worker(walletAddress: ${workerAddress}, totalPay: ${workerPay}, name: ${workerName})`;
        });
        console.log(workerList);

        const batchTxId = await payInBatch(workerList);
        console.log("Sending....");
        await fcl.tx(batchTxId).onceSealed();
        alert("Employees paid successfully");
      } catch (err) {
        console.error(err);
      }
    }

    return (
      <>
        <h1>Batch Upload with CSV</h1>
        <button
          onClick={async () => {
            console.log(await viewAllWorkers());
          }}
        >
          View All Workers
        </button>
        {/* File Drop happens here */}
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>
            Drag and Drop a CSV file here or click to upload workers in batch
          </p>
        </div>

        <br />
        <button onClick={() => callPayInBatch()}>Pay Workers in Batch</button>
      </>
    );
  }

  return (
    <>
      <div className="cards">
        <div onClick={handleFreelancer}>
          <span>Freelancer</span>
        </div>
        <div onClick={handleEmployer}>
          <span>Employee</span>
        </div>
      </div>
      {isFreelancer ? <Freelancer /> : ""}
      {isEmployer ? <Employer /> : ""}
    </>
  );
}
