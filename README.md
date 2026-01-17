# n8n-nodes-solana

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Solana blockchain providing 8 resources and 32+ operations for accounts, transactions, SPL tokens, NFTs, staking, and more. Includes WebSocket triggers for real-time events.

![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Solana](https://img.shields.io/badge/blockchain-Solana-purple)

## Features

- **Account Operations**: Check balances, get account info, list token accounts, view transaction history, request airdrops
- **Transaction Operations**: Send SOL, query transactions, check status, get recent blockhash
- **SPL Token Operations**: Get token balances, transfer tokens, view supply, create token accounts
- **NFT Operations (Metaplex)**: Get NFT metadata, list NFTs by owner
- **Staking Operations**: View stake accounts, check activation status, list validators, get epoch info
- **Program Operations**: Query program accounts with filters, get account data
- **Block Operations**: Get blocks by slot, current block height, slot, and block times
- **Cluster Operations**: Check node health, version, supply statistics, list cluster nodes
- **Real-time Triggers**: WebSocket subscriptions for account changes, program updates, logs, and more

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Click **Install a community node**
3. Enter `n8n-nodes-solana`
4. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-solana
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-solana.zip
cd n8n-nodes-solana

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Copy to n8n nodes directory
mkdir -p ~/.n8n/nodes
cp -r . ~/.n8n/nodes/n8n-nodes-solana

# 5. Restart n8n
n8n start
```

## Credentials Setup

| Field | Description |
|-------|-------------|
| **Network** | Select mainnet-beta, testnet, devnet, or custom |
| **Custom RPC URL** | Your custom RPC endpoint (only for custom network) |
| **Private Key** | Base58-encoded private key for signing transactions |
| **Commitment** | processed, confirmed, or finalized |
| **WebSocket URL** | Custom WebSocket endpoint (optional) |

## Resources & Operations

### Account Resource

| Operation | Description |
|-----------|-------------|
| Get Balance | Get SOL balance of an account |
| Get Account Info | Get full account information |
| Get Token Accounts | Get all token accounts for an address |
| Get Transaction History | Get recent transactions for an address |
| Request Airdrop | Request SOL airdrop (devnet/testnet only) |

### Transaction Resource

| Operation | Description |
|-----------|-------------|
| Send SOL | Send SOL to another address |
| Get Transaction | Get transaction details by signature |
| Get Transaction Status | Get transaction confirmation status |
| Get Recent Blockhash | Get recent blockhash for signing |

### SPL Token Resource

| Operation | Description |
|-----------|-------------|
| Get Token Balance | Get SPL token balance for an address |
| Transfer Token | Transfer SPL tokens to another address |
| Get Token Supply | Get total supply of an SPL token |
| Create Token Account | Create associated token account |
| Get Largest Accounts | Get largest token holders |

### NFT Resource

| Operation | Description |
|-----------|-------------|
| Get NFT Metadata | Get metadata for an NFT |
| Get NFTs by Owner | Get all NFTs owned by an address |

### Stake Resource

| Operation | Description |
|-----------|-------------|
| Get Stake Accounts | Get stake accounts for an address |
| Get Stake Activation | Get stake activation status |
| Get Validators | Get list of validators |
| Get Epoch Info | Get current epoch information |

### Program Resource

| Operation | Description |
|-----------|-------------|
| Get Program Accounts | Get accounts owned by a program |
| Get Account Data | Get parsed account data |

### Block Resource

| Operation | Description |
|-----------|-------------|
| Get Block | Get block by slot |
| Get Block Height | Get current block height |
| Get Slot | Get current slot |
| Get Block Time | Get block timestamp |

### Cluster Resource

| Operation | Description |
|-----------|-------------|
| Get Cluster Nodes | Get list of cluster nodes |
| Get Health | Check RPC node health |
| Get Version | Get Solana version |
| Get Supply | Get SOL supply statistics |

## Trigger Node

The Solana Trigger node supports real-time event subscriptions:

- **Account Change**: Trigger when an account balance or data changes
- **Program Account Change**: Trigger when any account owned by a program changes
- **Slot Change**: Trigger on every new slot
- **Root Change**: Trigger when a new root is set
- **Logs**: Trigger on program log messages

## Usage Examples

### Get Account Balance

```json
{
  "resource": "account",
  "operation": "getBalance",
  "address": "So11111111111111111111111111111111111111112"
}
```

### Send SOL

```json
{
  "resource": "transaction",
  "operation": "sendSol",
  "toAddress": "RecipientAddressHere",
  "amount": 0.1
}
```

### Get NFT Metadata

```json
{
  "resource": "nft",
  "operation": "getNftMetadata",
  "mintAddress": "NFTMintAddressHere"
}
```

## Networks

| Network | RPC URL |
|---------|---------|
| Mainnet | https://api.mainnet-beta.solana.com |
| Testnet | https://api.testnet.solana.com |
| Devnet | https://api.devnet.solana.com |

For production use, consider dedicated RPC providers:
- [Helius](https://helius.xyz)
- [QuickNode](https://quicknode.com)
- [Alchemy](https://alchemy.com)

## Error Handling

The node provides descriptive error messages for common issues:

- **Invalid Solana address**: Check the base58 encoding
- **Insufficient funds**: Not enough SOL for transaction + fees
- **Transaction expired**: Blockhash is too old, retry the transaction
- **Private key required**: Operation needs signing capability
- **Airdrop unavailable on mainnet**: Use devnet or testnet

## Security Best Practices

- Never share your private key
- Use separate wallets for testing and production
- Consider using environment variables for credentials
- Use dedicated RPC endpoints for production workloads

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint

# Format
npm run format

# Test
npm test
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-solana/issues)
- **Documentation**: [Solana Docs](https://docs.solana.com)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)
- **Author Website**: [velobpa.com](https://velobpa.com)

## Acknowledgments

- [Solana Foundation](https://solana.com) for the blockchain platform
- [Metaplex](https://metaplex.com) for NFT standards
- [n8n](https://n8n.io) for the workflow automation platform

## Changelog

### v1.0.0
- Initial release
- Full support for accounts, transactions, SPL tokens, NFTs, staking, programs, blocks, and cluster operations
- WebSocket trigger node for real-time events
- Metaplex NFT integration
