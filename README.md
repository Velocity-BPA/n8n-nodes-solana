# n8n-nodes-solana

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for interacting with the Solana blockchain ecosystem. This node provides 6 resources with full CRUD capabilities for accounts, transactions, blocks, tokens, programs, and validators, enabling seamless integration of Solana blockchain operations into your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)
![Blockchain](https://img.shields.io/badge/Blockchain-Integration-green)
![DeFi](https://img.shields.io/badge/DeFi-Ready-orange)

## Features

- **Account Management** - Query account balances, transaction history, and account information
- **Transaction Operations** - Send transactions, query transaction status, and retrieve transaction details
- **Block Explorer** - Access block data, query blockchain state, and retrieve block information
- **Token Operations** - Manage SPL tokens, query token accounts, and handle token transfers
- **Program Interaction** - Deploy and interact with Solana programs and smart contracts
- **Validator Monitoring** - Query validator information, stake accounts, and network performance
- **Real-time Data** - Access live blockchain data with configurable RPC endpoints
- **Error Handling** - Comprehensive error handling with detailed Solana-specific error messages

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
| API Key | Your Solana RPC API key from providers like Alchemy, QuickNode, or Helius | Yes |
| RPC Endpoint | Custom RPC endpoint URL (defaults to mainnet if not specified) | No |
| Network | Target network (mainnet-beta, devnet, testnet) | Yes |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve SOL balance for a specific account |
| Get Account Info | Get detailed account information including owner and executable status |
| Get Token Accounts | List all token accounts owned by an account |
| Get Transaction History | Retrieve transaction history for an account |
| Get Largest Accounts | Get accounts with the largest balances |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| Send Transaction | Submit a signed transaction to the network |
| Get Transaction | Retrieve transaction details by signature |
| Get Recent Transactions | Get recent transactions from the network |
| Simulate Transaction | Simulate a transaction without executing it |
| Get Transaction Count | Get the total transaction count |

### 3. Block

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by slot number |
| Get Recent Blocks | Get information about recent blocks |
| Get Block Height | Get the current block height |
| Get Block Time | Get the estimated time of a block |
| Get Block Production | Get block production information |

### 4. Token

| Operation | Description |
|-----------|-------------|
| Get Token Supply | Retrieve total supply information for a token |
| Get Token Accounts | Get all token accounts for a specific mint |
| Get Token Balance | Get token balance for a specific account |
| Get Token Metadata | Retrieve token metadata and information |
| Get Token Largest Accounts | Get largest holders of a specific token |

### 5. Program

| Operation | Description |
|-----------|-------------|
| Get Program Accounts | Get all accounts owned by a specific program |
| Get Program Info | Retrieve program account information |
| Call Program Method | Execute a program instruction |
| Get Program Logs | Retrieve program execution logs |
| Deploy Program | Deploy a new program to the network |

### 6. Validator

| Operation | Description |
|-----------|-------------|
| Get Validator Info | Retrieve validator information and status |
| Get Vote Accounts | Get current and delinquent vote accounts |
| Get Cluster Nodes | Get information about cluster nodes |
| Get Leader Schedule | Get leader schedule for upcoming slots |
| Get Validator Performance | Get validator performance metrics |

## Usage Examples

```javascript
// Get account balance
{
  "accountAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "commitment": "confirmed"
}
```

```javascript
// Send SOL transfer transaction
{
  "fromAddress": "4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi",
  "toAddress": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "amount": 1000000000,
  "privateKey": "your-base58-private-key"
}
```

```javascript
// Get token account information
{
  "mintAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "ownerAddress": "4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi",
  "encoding": "jsonParsed"
}
```

```javascript
// Query recent block information
{
  "slot": 150000000,
  "encoding": "json",
  "transactionDetails": "full",
  "rewards": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid Account Address | The provided account address is not valid base58 | Verify the account address format and ensure it's a valid Solana address |
| Insufficient Funds | Account doesn't have enough SOL for the transaction | Check account balance and ensure sufficient funds including transaction fees |
| Transaction Timeout | Transaction failed to confirm within timeout period | Increase timeout or check network congestion, retry with higher priority fee |
| RPC Rate Limit | API rate limit exceeded | Implement request throttling or upgrade to higher tier RPC service |
| Invalid Signature | Transaction signature is malformed or invalid | Verify transaction signing process and private key validity |
| Program Error | Smart contract execution failed | Check program logs and ensure correct instruction data format |

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
- **Solana Developer Resources**: [solana.com/developers](https://solana.com/developers)