import { config } from "@onflow/fcl";

config({
  // The name of our dApp to show when connecting to a wallet
  "app.detail.title": "Flow Name Service",
  // An image to use as the icon for our dApp when connecting to a wallet
  "app.detail.icon": "https://placekitten.com/g/200/200",
  // RPC URL for the Flow Testnet
  "accessNode.api": "https://rest-testnet.onflow.org",
  // A URL to discover the various wallets compatible with this network
  // FCL automatically adds support for all wallets which support Testnet
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  // Alias for our Contract on testnet
  "0xSwiftPayV1": "0x0ebf272d557470e1",
  "0xSwiftPayV2": "0x0ebf272d557470e1",
  "0xSwiftPayV3": "0x0ebf272d557470e1",
  // Testnet aliases for FungibleToken contracts
  "0xFungibleToken": "0x9a0766d93b6608b7",
});
