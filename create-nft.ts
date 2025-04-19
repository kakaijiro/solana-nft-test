import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  percentAmount,
  keypairIdentity,
  generateSigner,
  publicKey, // lower case
} from "@metaplex-foundation/umi";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey, // upper case
  clusterApiUrl,
} from "@solana/web3.js";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";

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

// create a new NFT
const collectionAddress = publicKey(
  "GBjQrbPvS99Kqcb2gV116BPmZNq1QbFJCkzpJ1TLHFFG" // pubkey created for nft collection
); // use umi's publicKey
console.log("Creating NFT...");
const mint = generateSigner(umi);
const transaction = createNft(umi, {
  mint,
  name: "Test NFT",
  uri: "https://raw.githubusercontent.com/kakaijiro/solana-nft-test/main/test-nft.json",
  sellerFeeBasisPoints: percentAmount(0),
  collection: { key: collectionAddress, verified: false },
});
await transaction.sendAndConfirm(umi);
const createdNft = await fetchDigitalAsset(umi, mint.publicKey);
console.log(
  `Created NFT 🖼️. Address is ${getExplorerLink(
    "address",
    createdNft.mint.publicKey,
    "devnet"
  )}`
);
