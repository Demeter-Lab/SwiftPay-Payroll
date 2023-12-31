// V2 is our code without that includes the feature to deposit Fungible tokens to the contract

import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub contract SwiftPay {

    // ======================================= EVENTS ======================================= //
    pub event WorkerAdded(name: String, amount: UFix64)
    pub event WorkerRemoved()
    

    /// Worker data structure
    pub struct Worker {

        // public variables of the struct
        // neccessary details to pay worker
        pub var walletAddress: Address
        pub var totalPay: UFix64 // salary - i.e. net salary

        // Additional worker data fields
        pub var name: String
        /** */
        // pub var paidAt: UFix64 // time salary was paid


        // Struct Initializer
        init( walletAddress: Address, totalPay: UFix64, name: String) {
            self.walletAddress = walletAddress
            self.totalPay = totalPay
            self.name = name

            // time salary is paid is generated by the contract 
            // self.paidAt = getCurrentBlock().timestamp
        }
    }


    /// Payment data structure
    pub struct Payment {
        pub var amount: UFix64
        pub var date: UFix64
        // Additional payment data fields

        // Struct Initializer
        init(amount: UFix64) {
            self.amount = amount
            self.date = getCurrentBlock().timestamp
        }
    }

    /// This interface provides the guidelines to adding a worker 
    /// manually (single) or in batch
    pub resource interface AddingWorker  {
        /// a dictionary data struction to store all workers
        pub var workers: {String: Worker}

        /// function to add a single worker 
        /// 
        /// @param walletAddress: The address of the worker to be added 
        /// @param totalPay: The amount of the money(tokens) to be paid. Must be of type UFix64 (e.g. 12.0)
        /// @param name: The name of the worker to be paid 

        /// @return a 'Worker' struct 
        pub fun addWorker (walletAddress: Address, totalPay: UFix64, name: String): Worker

        /// function to add workers in batch
        /// This enables workers an array of workers to be added in a single function call
        ///
        /// @param workerList: accepts an array of Structs to be added
        /// adds list of workers to the `workers` dictionary
        pub fun addWorkersInBatch(workerList: [Worker]): [Worker]
    }

    pub resource interface PaymentInterface {
        /// storage dictionary for payment history
        pub var payments: {String: [Payment]}
    }


    // resource for contract owner/employer
    // this resource holds variables & functions restricted to the payer only
    pub resource Payer: AddingWorker, PaymentInterface{
        /// dictionary for workers. This mapping is available to only employer
        pub var workers: {String: Worker}
        /// storage dictionary for payment history
        pub var payments: {String: [Payment]}

        // priv var signerVault: @FungibleToken.Vault

        /// function to add a worker
        /// restrict access to only owner to only payer
        pub fun addWorker (walletAddress: Address, totalPay: UFix64, name: String): Worker {
            let newWorker = Worker(walletAddress: walletAddress, totalPay: totalPay, name: name)
            self.workers[name] = newWorker
        
            return newWorker
        }

        /// function to add workers in batch
        pub fun addWorkersInBatch (workerList: [Worker]): [Worker] {
            // loop over list added then add workers
            for worker in workerList {
                self.workers[worker.name] = worker
            }
            
            return workerList
        }

        /// function to pay worker
        /// This function transfers fungible tokens (The $FLOW token in this case) from the payer to the worker
        pub fun payWorker (walletAddress: Address, vault: @FungibleToken.Vault){
           
           // deposit to receiver
           let receiverRef =  getAccount(walletAddress)
                .getCapability(/public/flowTokenReceiver)
                .borrow<&{FungibleToken.Receiver}>()
                ?? panic("Could not borrow receiver reference to the recipient's Vault")
           receiverRef.deposit(from: <- vault)
        } 

        init(){
            // self.signerVault <- vault
            self.workers = {}
            self.payments = {}
        }    
    }
}