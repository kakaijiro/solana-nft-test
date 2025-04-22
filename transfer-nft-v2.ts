import {
  mplTokenMetadata,
  transferV1,
  fetchDigitalAsset,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createUmi,
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { createUmi as createUmiWithDefaults } from "@metaplex-foundation/umi-bundle-defaults";
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
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { unwrapOption } from "@metaplex-foundation/umi";
import { Token } from "@metaplex-foundation/mpl-toolbox";

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

const umi = createUmiWithDefaults(rpcUrl);
const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));
umi.use(mplTokenMetadata());
console.log("Set up Umi instance for user");

// transfer the NFT
const mintAddress = new PublicKey(
  "6fDCSL1H17rGGnQJaP3GK9yDkLP4smMWp894EDMXgYR3"
);
const mintAddress2 = publicKey("6fDCSL1H17rGGnQJaP3GK9yDkLP4smMWp894EDMXgYR3");
const recipient = publicKey("YPMACqnPYhvgBC5VHQuHiDpbNFnhuWjhpAAzhSNLXcp"); // wallet
const tokenAccount = await getAssociatedTokenAddress(
  mintAddress,
  new PublicKey(umi.identity.publicKey)
);

// transfer nft transaction
const asset = await fetchDigitalAsset(umi, mintAddress2);
const tokenStandardOpt = unwrapOption(asset.metadata.tokenStandard);
if (!tokenStandardOpt) throw new Error("Token standard not found");

console.log(`Token standard: ${tokenStandardOpt}`);
console.log(`Now transferring NFT...`);
const transaction = transferV1(umi, {
  mint: mintAddress2,
  authority: umi.identity,
  tokenOwner: umi.identity.publicKey,
  destinationOwner: recipient,
  token: publicKey(tokenAccount),
  tokenStandard: tokenStandardOpt as TokenStandard,
});
const signature = await transaction.sendAndConfirm(umi);

console.log(
  `Successfully🎉 transferred NFT🖼️ to ${recipient.toString()} with the signature of ${signature}.`
);
