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
    import SwiftPayV1 from 0xSwiftPayV1

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

export async function payWorker(amount, walletAddress) {
  return fcl.mutate({
    cadence: PAY_WORKER,
    args: (arg, t) => [arg(amount, t.UFix64), arg(walletAddress, t.Address)],
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 1000,
  });
}

const PAY_WORKER = `
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction(amount: UFix64, to: Address) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {

        // Get a reference to the recipient's Receiver
        let receiverRef =  getAccount(to)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.sentVault)
    }
}
`;

export async function payInBatch() {
  return fcl.mutate({
    cadence: PAY_IN_BATCH,
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 1000,
  });
}

/**
const PAY_IN_BATCH = `
import SwiftPayV3 from 0xSwiftPayV3
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868


transaction() {
    let workerList: [SwiftPayV3.Worker] 

    prepare(account: AuthAccount) {
        self.workerList = [
            SwiftPayV3.Worker(
                walletAddress: 0xbfbce5075ba4b739,
                totalPay: 20.0,
                name: "Israel"
            ),
            SwiftPayV3.Worker(
                walletAddress: 0xf8894703ec0680b7,
                totalPay: 10.0,
                name: "Sandra"
            )
        ]
    }

    execute {
        SwiftPayV3.payInBatch(workerList: self.workerList)
    }
}
`;
*/

const PAY_IN_BATCH = `
import SwiftPayV3 from 0xSwiftPayV3
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

transaction() {
  let workerList: [SwiftPayV3.Worker]

  prepare(signer: AuthAccount) {
      self.workerList = [
          SwiftPayV3.Worker(
              walletAddress: 0xbfbce5075ba4b739,
              totalPay: 20.0,
              name: "Israel"
          ),
          SwiftPayV3.Worker(
              walletAddress: 0xf8894703ec0680b7,
              totalPay: 10.0,
              name: "Sandra"
          )
      ]

      for worker in self.workerList {

              let vaultRef = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault) 
                  ?? panic("Could not Borrow reference to the owner's Vault!")

              let sentVault <- vaultRef.withdraw(amount: worker.totalPay)

              let receiverRef = getAccount(worker.walletAddress)
                  .getCapability(/public/flowTokenReceiver)
                  .borrow<&{FungibleToken.Receiver}>()
                  ?? panic("Could not borrow receiver reference to the recipient's Vault")


              receiverRef.deposit(from: <- sentVault)
      }
  }

  execute {}
}

`;
