# n8n-nodes-solana

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Solana blockchain integration, providing access to 7 core resources including accounts, transactions, tokens, NFTs, staking, programs, and blocks. Enable seamless Solana blockchain operations within your n8n workflows with full support for wallet management, DeFi interactions, and on-chain data analysis.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Solana](https://img.shields.io/badge/Solana-Network-purple)
![Blockchain](https://img.shields.io/badge/Blockchain-Web3-orange)
![DeFi](https://img.shields.io/badge/DeFi-Ready-green)

## Features

- **Account Management** - Create, monitor, and manage Solana wallet accounts with balance tracking and transaction history
- **Transaction Processing** - Send, receive, and monitor SOL transfers and program interactions with full transaction details
- **Token Operations** - Complete SPL token support including transfers, minting, burning, and metadata management
- **NFT Integration** - Create, transfer, and manage Solana NFTs with metadata and collection support
- **Staking Operations** - Delegate SOL to validators, manage stake accounts, and track staking rewards
- **Program Interaction** - Deploy and interact with Solana programs including anchor-based smart contracts
- **Block Exploration** - Query blockchain data including blocks, transactions, and network statistics
- **Real-time Monitoring** - Subscribe to account changes and transaction confirmations

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
| API Key | Solana RPC endpoint API key for rate limiting and premium features | No |
| RPC URL | Custom Solana RPC endpoint URL (defaults to public mainnet) | No |
| Network | Solana network selection (mainnet-beta, testnet, devnet) | Yes |
| Private Key | Base58 encoded private key for transaction signing (store securely) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve SOL balance for a specific account |
| Get Info | Get detailed account information including owner and data |
| Create | Generate a new Solana keypair and account |
| Get Transaction History | List all transactions for an account |
| Monitor Changes | Watch for account balance or data changes |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Send SOL | Transfer SOL between accounts with memo support |
| Get Details | Retrieve transaction information by signature |
| Get Status | Check transaction confirmation status |
| Sign Transaction | Sign a transaction with provided private key |
| Simulate | Simulate transaction execution without committing |
| Get Recent | List recent transactions on the network |

### 3. Token

| Operation | Description |
|-----------|-------------|
| Transfer | Send SPL tokens between accounts |
| Get Balance | Check token balance for a specific mint and account |
| Create Mint | Create a new SPL token mint |
| Mint Tokens | Mint additional tokens to an account |
| Burn Tokens | Burn tokens from an account |
| Get Metadata | Retrieve token metadata and information |
| List Holdings | Get all token holdings for an account |

### 4. NFT

| Operation | Description |
|-----------|-------------|
| Mint | Create and mint a new NFT with metadata |
| Transfer | Transfer NFT ownership between accounts |
| Get Metadata | Retrieve NFT metadata including image and attributes |
| Update Metadata | Modify NFT metadata (if authorized) |
| List Owned | Get all NFTs owned by a specific account |
| Verify Collection | Add collection verification to an NFT |

### 5. Staking

| Operation | Description |
|-----------|-------------|
| Delegate Stake | Delegate SOL to a validator for staking rewards |
| Undelegate | Remove delegation from a validator |
| Get Stake Accounts | List all stake accounts for an address |
| Get Rewards | Retrieve staking reward history |
| Create Stake Account | Create a new stake account |
| Get Validators | List active validators and their performance metrics |

### 6. Program

| Operation | Description |
|-----------|-------------|
| Deploy | Deploy a compiled program to the Solana network |
| Invoke | Execute a program instruction with provided accounts |
| Get Info | Retrieve program account information and metadata |
| Get Accounts | List all accounts owned by a specific program |
| Update | Update an existing program (if upgrade authority) |
| Close | Close a program and reclaim rent |

### 7. Block

| Operation | Description |
|-----------|-------------|
| Get Latest | Retrieve the most recent block information |
| Get by Slot | Get block data for a specific slot number |
| Get by Hash | Retrieve block using its hash identifier |
| List Recent | Get a range of recent blocks |
| Get Production | View block production statistics by validators |
| Get Time | Get estimated production time for a slot |

## Usage Examples

```javascript
// Transfer SOL between accounts
{
  "from": "YourWalletPublicKey123...",
  "to": "RecipientPublicKey456...",
  "amount": 0.1,
  "memo": "Payment for services"
}
```

```javascript
// Check token balance for USDC
{
  "account": "TokenAccountPublicKey789...",
  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "decimals": 6
}
```

```javascript
// Mint an NFT with metadata
{
  "name": "My Awesome NFT",
  "symbol": "AWESOME",
  "description": "A unique digital collectible",
  "image": "https://example.com/nft-image.png",
  "attributes": [
    {"trait_type": "Background", "value": "Blue"},
    {"trait_type": "Rarity", "value": "Legendary"}
  ]
}
```

```javascript
// Delegate stake to a validator
{
  "stakeAccount": "StakeAccountPublicKey123...",
  "validatorVote": "ValidatorVoteAccount456...",
  "amount": 10,
  "authorized": "AuthorizedStakerKey789..."
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| InsufficientFunds | Account lacks sufficient SOL for transaction | Check account balance and add more SOL |
| InvalidSignature | Transaction signature verification failed | Verify private key and transaction data |
| AccountNotFound | Referenced account doesn't exist on-chain | Ensure account address is correct and funded |
| ProgramError | Smart contract execution failed | Check program logs and instruction parameters |
| NetworkTimeout | RPC request timed out | Retry request or use different RPC endpoint |
| TokenAccountNotFound | SPL token account missing for mint | Create associated token account first |

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
- **Solana Developer Portal**: [solana.com/developers](https://solana.com/developers)