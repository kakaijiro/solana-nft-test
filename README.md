# Solana NFT Collection Demo

This project demonstrates how to create, manage, transfer, and verify NFTs and NFT collections on Solana Devnet using the Metaplex and Solana SDKs.

## Project Structure

- `create-collection.ts` — Create a new NFT collection.
- `create-nft.ts` — Mint a new NFT and assign it to a collection.
- `verify-nft.ts` — Verify an NFT as a member of a collection.
- `transfer-nft-v1.ts` — Transfer an NFT using SPL Token methods.
- `transfer-nft-v2.ts` — Transfer an NFT using Metaplex's transferV1.
- `balance-nft.ts` — Check NFT balances for user and recipient.
- `metadata.json` — Metadata for the NFT collection.
- `test-nft.json` — Metadata for a test NFT.

## Usage

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Set up your Solana keypair:**
   Place your keypair at `/home/<userName>/.config/solana/id.json` or update the scripts to use your path.

3. **Run scripts:**
   Use [esrun](https://github.com/esbuild-kit/esrun) or another TypeScript runner:
   ```sh
   npx esrun create-collection.ts
   npx esrun create-nft.ts
   npx esrun verify-nft.ts
   npx esrun transfer-nft-v1.ts
   npx esrun transfer-nft-v2.ts
   npx esrun balance-nft.ts
   ```

## Explorer Links

- **NFT Collection:**  
  [GBjQrbPvS99Kqcb2gV116BPmZNq1QbFJCkzpJ1TLHFFG (Devnet)](https://explorer.solana.com/address/GBjQrbPvS99Kqcb2gV116BPmZNq1QbFJCkzpJ1TLHFFG?cluster=devnet)

- **NFT Example:**  
  [6fDCSL1H17rGGnQJaP3GK9yDkLP4smMWp894EDMXgYR3 (Devnet)](https://explorer.solana.com/address/6fDCSL1H17rGGnQJaP3GK9yDkLP4smMWp894EDMXgYR3?cluster=devnet)

## Resources

- [Metaplex Docs](https://docs.metaplex.com/)
- [Solana Cookbook](https://solanacookbook.com/)
- [@solana-developers/helpers](https://www.npmjs.com/package/@solana-developers/helpers)

---

**Note:** All scripts are configured for Solana Devnet.
