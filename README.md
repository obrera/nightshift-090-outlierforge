# OutlierForge 090

Live URL: https://outlierforge090.colmena.dev

OutlierForge 090 is a dark-mode OPOS-inspired playable character NFT forge for Solana week. Players compose body/class, headgear, armor, weapon, and companion traits, inspect stats, rarity, compatibility rules, and mint readiness, then mint a wallet-signed MPL Core devnet character asset.

## Challenge Reference

- Build: Nightshift 090
- Product family: custom NFT trait composition for game characters
- Primary actor: player/collector composing a playable character
- Secondary actor: game creator/operator tuning trait rules and mint readiness
- Why NFT ownership matters: the composed character becomes transferable, provable game identity with first-party generated metadata/artwork and holder-verifiable traits.

## Architecture

- React 19, Vite, TypeScript, Tailwind CSS v4, React Query, wallet-ui, Solana Kit.
- No `@solana/web3.js`, no wallet-adapter React, and no app/server `Buffer` dependency.
- `@obrera/mpl-core-kit-lib/generated` supplies `getCreateV1Instruction` for MPL Core CreateV1.
- Feature code lives under `src/outlierforge` with `data-access`, `feature`, `ui`, and `util` boundaries.
- The Bun server serves `/health`, `/api/health`, `/api/bootstrap`, `/metadata/<slug>.json`, `/metadata/<slug>.svg`, and the built SPA.

## Wallet-Signed Mint

The live UI uses wallet-ui connection state and wallet-ui signer hooks only when an account exists. The connected wallet is payer, authority, update authority, and owner. The MPL Core asset signer is browser-generated with `@solana/kit` `generateKeyPairSigner`. There is no server mint path.

The proof script mirrors the same shared metadata builder and `getOutlierforgeCreateInstruction` used by the UI, but signs with `/home/obrera/keys/obrE1BHvP4EX8PkxPxAJxYfQkgfgCmXyJadQA3yBb7G.json` as a stand-in wallet for CI/manual proof.

```bash
bun run proof:mint
```

Expected output includes:

```text
asset=<asset address>
tx=<transaction signature>
explorer=<devnet explorer asset URL>
```

## Run Locally

```bash
bun install
bun run dev
```

Open `http://localhost:5173`.

## Production Preview

```bash
bun run build
PORT=3000 bun run preview
```

Open `http://localhost:3000`.

## Commands

```bash
bun run lint:fix
bun run check-types
bun run build
bun run proof:mint
```

## Deploy

Dokploy can build the included single-container Docker setup:

```bash
docker compose up --build
```

The container uses `oven/bun`, builds the Vite app inside Docker, and serves on `PORT=3000`.

## Agent

- Agent/model: OpenAI GPT-5 Codex
- Reasoning: medium
