import * as fcl from "@onflow/fcl";

export async function addWorker(name, walletAddress, totalPay) {
  return fcl.mutate({
    cadence: ADD_WORKER,
    args: (arg, t) => [
      arg(name, t.String),
      arg(walletAddress, t.Address),
      arg(totalPay, t.UFix64),
    ],
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 1000,
  });
}

const ADD_WORKER = `
    transaction (name: String, walletAddress: Address, totalPay: UFix64) {
        // Define the worker details
        let name: String // = "Mide Dev" // Set the worker's name
        let totalPay: UFix64 // = 25.0 // Set the desired totalPay
        let walletAddress: Address // = 0x6c34ad0aefec24cc

        prepare(account: AuthAccount) {
            self.name = name
            self.totalPay = totalPay
            self.walletAddress = walletAddress
        }

        execute {
            // Add the worker
            let newWorker = SwiftPayV1.addWorker(walletAddress: self.walletAddress, totalPay: self.totalPay, name: self.name)
            log("Worker added: ")
            log(newWorker)
        }
    }
`;
