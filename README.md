# n8n-nodes-solana

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with the Solana blockchain, featuring 5 core resources: Account, Transaction, Token, Block, and Staking. Enables seamless automation of Solana operations including balance queries, transaction monitoring, token transfers, block data retrieval, and staking management within your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)
![RPC](https://img.shields.io/badge/RPC-JSON--RPC%202.0-green)
![Mainnet](https://img.shields.io/badge/Network-Mainnet%2FDevnet-orange)

## Features

- **Account Management** - Query account balances, token holdings, and account information across Solana networks
- **Transaction Operations** - Send SOL transfers, monitor transaction status, and retrieve transaction history
- **Token Integration** - Manage SPL tokens, check token balances, and execute token transfers
- **Block Data Access** - Fetch block information, retrieve block heights, and monitor blockchain state
- **Staking Management** - Query stake accounts, monitor validator performance, and manage staking operations
- **Multi-Network Support** - Compatible with Mainnet, Devnet, and Testnet environments
- **Real-time Monitoring** - Support for account change subscriptions and transaction confirmations
- **Error Resilience** - Comprehensive error handling with automatic retry mechanisms

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
| **RPC Endpoint** | Solana RPC endpoint URL (e.g., https://api.mainnet-beta.solana.com) | Yes |
| **API Key** | RPC provider API key for authenticated requests | Yes |
| **Network** | Target network (mainnet-beta, devnet, testnet) | Yes |
| **Private Key** | Base58 encoded private key for transaction signing (optional) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| **Get Balance** | Retrieve SOL balance for a specific account address |
| **Get Account Info** | Fetch detailed account information including owner and data |
| **Get Token Accounts** | List all token accounts owned by an address |
| **Get Token Balance** | Check balance of a specific SPL token for an account |
| **Get Transaction History** | Retrieve transaction history for an account |
| **Subscribe to Changes** | Monitor account changes in real-time |

### 2. Transaction

| Operation | Description |
|-----------|-------------|
| **Send SOL** | Transfer SOL from one account to another |
| **Get Transaction** | Retrieve transaction details by signature |
| **Get Transaction Status** | Check confirmation status of a transaction |
| **Get Recent Transactions** | Fetch recent transactions from the network |
| **Simulate Transaction** | Simulate transaction execution without sending |
| **Get Transaction Count** | Retrieve total transaction count for the network |

### 3. Token

| Operation | Description |
|-----------|-------------|
| **Transfer Token** | Send SPL tokens between accounts |
| **Get Token Info** | Retrieve metadata and supply information for a token |
| **Create Token Account** | Create a new token account for holding specific tokens |
| **Get Token Supply** | Check total and circulating supply of a token |
| **Get Token Holders** | List accounts holding a specific token |
| **Burn Tokens** | Burn tokens from a token account |

### 4. Block

| Operation | Description |
|-----------|-------------|
| **Get Block** | Retrieve block data by slot number |
| **Get Block Height** | Get current block height of the network |
| **Get Block Time** | Fetch timestamp for a specific block |
| **Get Recent Blocks** | List recent blocks with transaction counts |
| **Get Block Production** | Monitor block production by validators |
| **Get Slot Leaders** | Retrieve slot leader schedule |

### 5. Staking

| Operation | Description |
|-----------|-------------|
| **Get Stake Accounts** | List stake accounts for a wallet address |
| **Create Stake Account** | Create a new stake account |
| **Delegate Stake** | Delegate stake to a validator |
| **Withdraw Stake** | Withdraw stake from a stake account |
| **Get Validator Info** | Retrieve validator details and performance metrics |
| **Get Staking Rewards** | Calculate staking rewards for an epoch |

## Usage Examples

```javascript
// Get SOL balance for an account
const accountBalance = await $('Solana').getBalance({
  address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
});
console.log(`Balance: ${accountBalance.value / 1e9} SOL`);
```

```javascript
// Send SOL transaction
const transaction = await $('Solana').sendSOL({
  from: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
  to: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  amount: 0.1 * 1e9, // 0.1 SOL in lamports
  commitment: 'confirmed'
});
console.log(`Transaction: ${transaction.signature}`);
```

```javascript
// Transfer SPL tokens
const tokenTransfer = await $('Solana').transferToken({
  mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  from: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
  to: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  amount: 10 * 1e6, // 10 USDC
  decimals: 6
});
```

```javascript
// Get current block information
const blockInfo = await $('Solana').getBlock({
  slot: 'finalized',
  encoding: 'json',
  transactionDetails: 'signatures',
  maxSupportedTransactionVersion: 0
});
console.log(`Block ${blockInfo.slot} has ${blockInfo.transactions.length} transactions`);
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| **Invalid API Key** | Authentication failed with RPC provider | Verify API key in credentials and check provider status |
| **Insufficient Balance** | Account lacks funds for transaction | Check account balance and ensure sufficient SOL for fees |
| **Invalid Address** | Provided address is not a valid Solana address | Validate address format using base58 encoding |
| **Network Timeout** | RPC request exceeded timeout limit | Retry request or switch to different RPC endpoint |
| **Transaction Failed** | Transaction simulation or execution failed | Check transaction parameters and account permissions |
| **Rate Limited** | Too many requests to RPC endpoint | Implement request throttling or upgrade RPC plan |

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
- **Solana Documentation**: [Solana RPC API Documentation](https://docs.solana.com/api)
- **Developer Resources**: [Solana Cookbook](https://solanacookbook.com)