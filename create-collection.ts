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
import {
  createUmi,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi-bundle-defaults";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { generateSigner } from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile("/home/jirok/.config/solana/id.json");
console.log(`user: ${user.publicKey.toBase58()}`);

await airdropIfRequired(
  connection,
  user.publicKey,
  1 * LAMPORTS_PER_SOL,
  0.5 * LAMPORTS_PER_SOL
);
console.log(`Airdropped 1 SOL to ${user.publicKey.toBase58()}`);

const umi = createUmi("https://api.devnet.solana.com");
umi.use(mplTokenMetadata());
const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));
const collectionMint = generateSigner(umi);
const transaction = await createNft(umi, {
  mint: collectionMint,
  name: "test collection",
  symbol: "MYCOL",
  uri: "https://example.com/metadata.json",
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
