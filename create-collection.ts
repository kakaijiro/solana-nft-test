import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  airdropIfRequired,
  getExplorerLink,
  getKeypairFromFile,
} from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  percentAmount,
  keypairIdentity,
  generateSigner,
} from "@metaplex-foundation/umi";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

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
const collectionMint = generateSigner(umi);
const transaction = createNft(umi, {
  mint: collectionMint,
  name: "test collection",
  symbol: "TC",
  uri: "https://raw.githubusercontent.com/kakaijiro/solana-nft-test/main/metadata.json",
  sellerFeeBasisPoints: percentAmount(0),
  isCollection: true,
});
await transaction.sendAndConfirm(umi);
const createdCollectionNft = await fetchDigitalAsset(
  umi,
  collectionMint.publicKey
);
console.log(
  `Created collection address is ${getExplorerLink(
    "address",
    createdCollectionNft.publicKey,
    "devnet"
  )}`
);
