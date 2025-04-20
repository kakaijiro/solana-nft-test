import {
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  keypairIdentity,
  publicKey, // lower case
} from "@metaplex-foundation/umi";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
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

// verify the created NFT
const collectionAddress = publicKey(
  "GBjQrbPvS99Kqcb2gV116BPmZNq1QbFJCkzpJ1TLHFFG" // pubkey created for nft collection
); // use umi's publicKey
const nftAddress = publicKey(
  "6fDCSL1H17rGGnQJaP3GK9yDkLP4smMWp894EDMXgYR3" // pubkey created for nft
); // use umi's publicKey
console.log("Verifying a NFT as a member of the collection...");
const transaction = verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, {
    mint: nftAddress,
  }),
  collectionMint: collectionAddress,
  authority: umi.identity,
});
await transaction.sendAndConfirm(umi);
console.log(
  `✅NFT ${nftAddress} was verified as a member of collection ${collectionAddress}. See explorer at ${getExplorerLink(
    "address",
    nftAddress,
    "devnet"
  )}`
);
