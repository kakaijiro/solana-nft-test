import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity } from "@metaplex-foundation/umi";
import {
  Connection,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";
import {
  airdropIfRequired,
  getKeypairFromFile,
  getExplorerLink,
} from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const rpcUrl = clusterApiUrl("devnet");
const connection = new Connection(rpcUrl);
const user = await getKeypairFromFile("/home/jirok/.config/solana/id.json");
console.log(`user: ${user.publicKey.toBase58()}`);

const mintAddress = new PublicKey(
  "6fDCSL1H17rGGnQJaP3GK9yDkLP4smMWp894EDMXgYR3"
);
const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  mintAddress,
  user.publicKey
);
const senderBalance = await connection.getTokenAccountBalance(
  fromTokenAccount.address
);
console.log("User NFT balance:", senderBalance.value.uiAmount);

const recipient = new PublicKey("YPMACqnPYhvgBC5VHQuHiDpbNFnhuWjhpAAzhSNLXcp"); // wallet
console.log(`Recipient: ${recipient.toBase58()}`);
const toTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  mintAddress,
  recipient
);
const recipientBalance = await connection.getTokenAccountBalance(
  toTokenAccount.address
);
console.log("Recipient NFT balance:", recipientBalance.value.uiAmount);
