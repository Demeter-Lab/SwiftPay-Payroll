import * as fcl from "@onflow/fcl";

export async function viewAllWorkers() {
  return fcl.query({
    cadence: VIEW_ALL_WORKERS,
  });
}

const VIEW_ALL_WORKERS = `
import SwiftPayV1 from 0xSwiftPayV1

pub fun main(): {String: SwiftPayV1.Worker} {
    return SwiftPayV1.workers
  
  }
  

`;
