import FungibleToken from 0x9a0766d93b6608b7
// import MyFlowToken from 0x05

pub contract SwiftPay {
    /** TASKS TO DO
     * Deposit Tokens to Contract (May not need sef)
     * Add Worker (single)
     * Add Workers (batch)
     * Pay workers in Flow OR custom token
     * 
    */


    // ============================ DICTIONARY (i.e. Mappings) ============================ //
    // dictionary for workers => Make this mapping available to only employer
    pub var workers: {String: Worker}
    // storage dictionary for payment history
    pub var payments: {String: [Payment]}

    init(){
        self.workers = {}
        self.payments = {}
    }

    // ======================================= EVENTS ======================================= //
    pub event WorkerAdded(name: String, amount: UFix64)
    pub event WorkerRemoved()
    

    // Worker data structure
    pub struct Worker {

        // public variables of the struct
        // neccessary details to pay worker
        pub var walletAddress: Address
        pub var totalPay: UFix64 // salary - i.e. net salary

        // Additional worker data fields
        pub var name: String
        /** */
        pub var paidAt: UFix64 // time salary was paid


        // Struct Initializer
        init( walletAddress: Address, totalPay: UFix64, name: String) {
            self.walletAddress = walletAddress
            self.totalPay = totalPay
            self.name = name

            // time salary is paid is generated by the contract 
            self.paidAt = getCurrentBlock().timestamp
        }
    }


    // Payment data structure
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

    // function to add an worker
    // add other details here
    // restrict access to only owner to access(account)
    access(account) fun addWorker (walletAddress: Address, totalPay: UFix64, name: String): Worker {
        let newWorker = Worker(walletAddress: walletAddress, totalPay: totalPay, name: name)
        self.workers[name] = newWorker
        return newWorker
    }


    // function to add workers in batch
    access(account) fun addworkersInBatch (workerList: [Worker]): [Worker] {
        // loop over list added then add workers
        for worker in workerList {
            self.workers[worker.name] = worker
        }
        return workerList
    }

    // THIS FUNCTION SHOULD BE CALLED AT THE TIME OF PAYMENT 
    // && ONLY OWNER/CONTRACT SHOULD HAVE ACCESS
    // @dev function pays


    // access






}