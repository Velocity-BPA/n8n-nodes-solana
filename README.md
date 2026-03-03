# n8n-nodes-solana

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for interacting with the Solana blockchain, featuring 5 resources (Account, Transaction, Token, NFT, Staking) with complete CRUD operations for building decentralized applications, managing digital assets, and automating blockchain workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana)
![Web3](https://img.shields.io/badge/Web3-F16822?logo=web3.js)
![Blockchain](https://img.shields.io/badge/Blockchain-121D33?logo=blockchain.com)

## Features

- **Account Management** - Create, query, and manage Solana accounts with balance tracking and transaction history
- **Transaction Processing** - Send, receive, and monitor SOL transfers with comprehensive transaction details
- **SPL Token Operations** - Create, mint, transfer, and burn SPL tokens with metadata management
- **NFT Marketplace Integration** - Mint, transfer, and query Solana NFTs with metadata and collection support
- **Staking Operations** - Delegate, undelegate, and monitor staking rewards across validator networks
- **Real-time Monitoring** - Track account changes, transaction confirmations, and network events
- **Multi-Network Support** - Connect to Mainnet, Testnet, and Devnet environments
- **Batch Operations** - Process multiple transactions and queries efficiently in single workflows

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-solana`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-solana
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-solana.git
cd n8n-nodes-solana
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-solana
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Solana RPC API key (from Alchemy, QuickNode, etc.) | Yes |
| Network | Solana network (mainnet-beta, testnet, devnet) | Yes |
| RPC Endpoint | Custom RPC endpoint URL (optional if using standard networks) | No |
| Private Key | Base58 encoded private key for transaction signing | Yes (for write operations) |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve SOL balance for a specific account |
| Get Account Info | Fetch detailed account information including owner and data |
| Get Transaction History | List all transactions for an account |
| Create Account | Generate a new Solana keypair and account |
| Fund Account | Add SOL to an account (testnet/devnet only) |
| Get Token Accounts | List all SPL token accounts owned by an address |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Send SOL | Transfer SOL between accounts |
| Get Transaction | Retrieve transaction details by signature |
| Get Recent Transactions | Fetch latest transactions on the network |
| Simulate Transaction | Test transaction execution without broadcasting |
| Get Transaction Status | Check confirmation status of a transaction |
| Batch Transfer | Send SOL to multiple recipients in one transaction |

### 3. Token

| Operation | Description |
|-----------|-------------|
| Create Token | Create a new SPL token mint |
| Mint Tokens | Mint tokens to a specified account |
| Transfer Tokens | Send SPL tokens between accounts |
| Burn Tokens | Destroy tokens from circulation |
| Get Token Supply | Retrieve total and circulating supply |
| Get Token Balance | Check SPL token balance for an account |
| Freeze Account | Freeze a token account (if mint authority) |
| Thaw Account | Unfreeze a previously frozen token account |

### 4. NFT

| Operation | Description |
|-----------|-------------|
| Mint NFT | Create and mint a new NFT |
| Transfer NFT | Send NFT to another wallet |
| Get NFT Metadata | Retrieve NFT metadata and attributes |
| Update NFT | Modify NFT metadata (if update authority) |
| Burn NFT | Permanently destroy an NFT |
| Get NFTs by Owner | List all NFTs owned by an address |
| Verify Collection | Add NFT to a verified collection |

### 5. Staking

| Operation | Description |
|-----------|-------------|
| Delegate Stake | Delegate SOL to a validator |
| Undelegate Stake | Remove delegation from a validator |
| Get Stake Accounts | List all stake accounts for an address |
| Get Validators | Retrieve list of active validators |
| Get Staking Rewards | Calculate staking rewards for an epoch |
| Withdraw Stake | Withdraw undelegated stake |
| Split Stake | Divide stake account into multiple accounts |

## Usage Examples

```javascript
// Get account balance
{
  "account": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "commitment": "confirmed"
}
```

```javascript
// Send SOL transfer
{
  "fromAddress": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
  "toAddress": "4fYNw3dojWmQ4dXtSGE9epjRGy9pFSx62YypT7avPYvA",
  "amount": 0.1,
  "memo": "Payment for services"
}
```

```javascript
// Mint new NFT
{
  "name": "Velocity Art #001",
  "symbol": "VBA",
  "description": "Limited edition digital artwork",
  "image": "https://arweave.net/abc123",
  "attributes": [
    {"trait_type": "Color", "value": "Blue"},
    {"trait_type": "Rarity", "value": "Legendary"}
  ],
  "royaltyPercent": 5
}
```

```javascript
// Delegate stake to validator
{
  "stakeAccount": "StakeAccount1111111111111111111111111111111",
  "validatorAddress": "Vote111111111111111111111111111111111111111",
  "amount": 10.5,
  "lockup": {
    "epoch": 500,
    "custodian": null
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Insufficient Funds | Account balance too low for transaction | Verify account has enough SOL for transaction and fees |
| Invalid Signature | Transaction signature verification failed | Check private key matches the sender address |
| Blockhash Not Found | Transaction blockhash is too old | Retry with a recent blockhash from the network |
| Account Not Found | Specified account doesn't exist on-chain | Verify account address and network selection |
| Token Account Not Found | SPL token account doesn't exist | Create associated token account before transfer |
| RPC Rate Limit | API rate limit exceeded | Use API key or reduce request frequency |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
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
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-solana/issues)
- **Solana Documentation**: [docs.solana.com](https://docs.solana.com)
- **Solana Developer Discord**: [solana.com/discord](https://solana.com/discord)