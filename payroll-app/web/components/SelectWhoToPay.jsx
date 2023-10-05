import { useCallback, useState } from "react";
import { addWorker } from "@/flow-interactions/transactions";
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
      if ((name && address, totalPay)) {
        // if successful alert
        (await addWorker(name, address, totalPay)) &&
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
        <button>Add Workers in Batch</button>
      </>
    );
  }

  function handleCSVUpload() {}

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
