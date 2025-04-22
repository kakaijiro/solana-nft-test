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

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);
console.log(`Airdropped 1 SOL to ${user.publicKey.toBase58()}`);

const umi = createUmi(rpcUrl);
umi.use(mplTokenMetadata());
const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));
console.log("Set up Umi instance for user");

// transfer the NFT
const mintAddress = new PublicKey(
  "6fDCSL1H17rGGnQJaP3GK9yDkLP4smMWp894EDMXgYR3"
);
const recipient = new PublicKey("YPMACqnPYhvgBC5VHQuHiDpbNFnhuWjhpAAzhSNLXcp"); // wallet

// transfer nft transaction
const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  mintAddress,
  user.publicKey
);
const toTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  mintAddress,
  recipient
);
// check balances
let senderBalance = await connection.getTokenAccountBalance(
  fromTokenAccount.address
);
let recipientBalance = await connection.getTokenAccountBalance(
  toTokenAccount.address
);
console.log("Sender NFT balance:", senderBalance.value.uiAmount);
console.log("Recipient NFT balance:", recipientBalance.value.uiAmount);
console.log("Transfering NFT...");
const signature = await transfer(
  connection,
  user,
  fromTokenAccount.address,
  toTokenAccount.address,
  user.publicKey,
  1
);
// check balances again
senderBalance = await connection.getTokenAccountBalance(
  fromTokenAccount.address
);
recipientBalance = await connection.getTokenAccountBalance(
  toTokenAccount.address
);
console.log("Sender NFT balance:", senderBalance.value.uiAmount);
console.log("Recipient NFT balance:", recipientBalance.value.uiAmount);

console.log(
  `Successfully🎉 transferred NFT🖼️ to ${recipient.toString()} with the signature of ${signature}. For further information, see : ${getExplorerLink(
    "tx",
    signature,
    "devnet"
  )}`
);
