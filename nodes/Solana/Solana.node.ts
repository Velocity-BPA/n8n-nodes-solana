/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-solana/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Solana implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Solana',
    name: 'solana',
    icon: 'file:solana.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Solana API',
    defaults: {
      name: 'Solana',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'solanaApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Token',
            value: 'token',
          },
          {
            name: 'NFT',
            value: 'nFT',
          },
          {
            name: 'Staking',
            value: 'staking',
          }
        ],
        default: 'account',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['account'],
    },
  },
  options: [
    {
      name: 'Get Account Info',
      value: 'getAccountInfo',
      description: 'Get account data and owner information',
      action: 'Get account info',
    },
    {
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get SOL balance for an account',
      action: 'Get balance',
    },
    {
      name: 'Get Multiple Accounts',
      value: 'getMultipleAccounts',
      description: 'Get information for multiple accounts',
      action: 'Get multiple accounts',
    },
    {
      name: 'Get Token Accounts By Owner',
      value: 'getTokenAccountsByOwner',
      description: 'Get token accounts owned by account',
      action: 'Get token accounts by owner',
    },
    {
      name: 'Get Program Accounts',
      value: 'getProgramAccounts',
      description: 'Get accounts owned by a program',
      action: 'Get program accounts',
    },
  ],
  default: 'getAccountInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
    },
  },
  options: [
    {
      name: 'Get Transaction',
      value: 'getTransaction',
      description: 'Get transaction details by signature',
      action: 'Get transaction',
    },
    {
      name: 'Get Signatures for Address',
      value: 'getSignaturesForAddress',
      description: 'Get transaction signatures for an address',
      action: 'Get signatures for address',
    },
    {
      name: 'Send Transaction',
      value: 'sendTransaction',
      description: 'Submit a transaction to the cluster',
      action: 'Send transaction',
    },
    {
      name: 'Simulate Transaction',
      value: 'simulateTransaction',
      description: 'Simulate a transaction',
      action: 'Simulate transaction',
    },
    {
      name: 'Get Recent Blockhash',
      value: 'getRecentBlockhash',
      description: 'Get recent blockhash for transactions',
      action: 'Get recent blockhash',
    },
    {
      name: 'Get Fee for Message',
      value: 'getFeeForMessage',
      description: 'Get fee for a message',
      action: 'Get fee for message',
    },
  ],
  default: 'getTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['token'],
    },
  },
  options: [
    {
      name: 'Get Token Account Balance',
      value: 'getTokenAccountBalance',
      description: 'Get the balance of a specific token account',
      action: 'Get token account balance',
    },
    {
      name: 'Get Token Supply',
      value: 'getTokenSupply',
      description: 'Get the total supply of a token',
      action: 'Get token supply',
    },
    {
      name: 'Get Token Accounts By Delegate',
      value: 'getTokenAccountsByDelegate',
      description: 'Get token accounts by delegate authority',
      action: 'Get token accounts by delegate',
    },
    {
      name: 'Get Token Largest Accounts',
      value: 'getTokenLargestAccounts',
      description: 'Get the largest token accounts for a mint',
      action: 'Get token largest accounts',
    },
    {
      name: 'Get Minimum Balance For Rent Exemption',
      value: 'getMinimumBalanceForRentExemption',
      description: 'Get minimum balance required for rent exemption',
      action: 'Get minimum balance for rent exemption',
    },
  ],
  default: 'getTokenAccountBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['nFT'],
    },
  },
  options: [
    {
      name: 'Get Account Info',
      value: 'getAccountInfo',
      description: 'Get NFT mint account information',
      action: 'Get NFT account info',
    },
    {
      name: 'Get Token Accounts By Owner',
      value: 'getTokenAccountsByOwner',
      description: 'Get NFT token accounts by owner',
      action: 'Get token accounts by owner',
    },
    {
      name: 'Get Program Accounts',
      value: 'getProgramAccounts',
      description: 'Get accounts from Metaplex programs',
      action: 'Get program accounts',
    },
    {
      name: 'Get Multiple Accounts',
      value: 'getMultipleAccounts',
      description: 'Get multiple NFT-related accounts',
      action: 'Get multiple accounts',
    },
    {
      name: 'Get Token Supply',
      value: 'getTokenSupply',
      description: 'Verify NFT uniqueness via supply check',
      action: 'Get token supply',
    },
  ],
  default: 'getAccountInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['staking'],
    },
  },
  options: [
    {
      name: 'Get Stake Activation',
      value: 'getStakeActivation',
      description: 'Get stake account activation info',
      action: 'Get stake activation',
    },
    {
      name: 'Get Vote Accounts',
      value: 'getVoteAccounts',
      description: 'Get vote accounts and validator info',
      action: 'Get vote accounts',
    },
    {
      name: 'Get Inflation Reward',
      value: 'getInflationReward',
      description: 'Get inflation rewards for accounts',
      action: 'Get inflation reward',
    },
    {
      name: 'Get Epoch Info',
      value: 'getEpochInfo',
      description: 'Get current epoch information',
      action: 'Get epoch info',
    },
    {
      name: 'Get Validators',
      value: 'getValidators',
      description: 'Get validator information',
      action: 'Get validators',
    },
    {
      name: 'Get Delegated Stake',
      value: 'getDelegatedStake',
      description: 'Get delegated stake for validators',
      action: 'Get delegated stake',
    },
  ],
  default: 'getStakeActivation',
},
      // Parameter definitions
{
  displayName: 'Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getAccountInfo', 'getBalance', 'getTokenAccountsByOwner', 'getProgramAccounts'],
    },
  },
  default: '',
  description: 'The public key of the account to query (base58 encoded)',
},
{
  displayName: 'Public Keys',
  name: 'pubkeys',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getMultipleAccounts'],
    },
  },
  default: '',
  description: 'Comma-separated list of public keys to query (base58 encoded)',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['account'],
    },
  },
  options: [
    {
      name: 'Finalized',
      value: 'finalized',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
    },
    {
      name: 'Processed',
      value: 'processed',
    },
  ],
  default: 'finalized',
  description: 'Desired commitment level',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getAccountInfo', 'getMultipleAccounts'],
    },
  },
  options: [
    {
      name: 'Base58',
      value: 'base58',
    },
    {
      name: 'Base64',
      value: 'base64',
    },
    {
      name: 'JSON Parsed',
      value: 'jsonParsed',
    },
  ],
  default: 'base64',
  description: 'Encoding format for account data',
},
{
  displayName: 'Filter Type',
  name: 'filterType',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getTokenAccountsByOwner'],
    },
  },
  options: [
    {
      name: 'By Mint',
      value: 'mint',
    },
    {
      name: 'By Program ID',
      value: 'programId',
    },
  ],
  default: 'mint',
  description: 'Filter token accounts by mint or program ID',
},
{
  displayName: 'Mint Address',
  name: 'mint',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getTokenAccountsByOwner'],
      filterType: ['mint'],
    },
  },
  default: '',
  description: 'Mint address to filter by (base58 encoded)',
},
{
  displayName: 'Program ID',
  name: 'programId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getTokenAccountsByOwner', 'getProgramAccounts'],
      filterType: ['programId'],
    },
  },
  default: '',
  description: 'Program ID to filter by (base58 encoded)',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getProgramAccounts'],
    },
  },
  default: '',
  description: 'JSON string of filters to apply (optional)',
},
{
  displayName: 'Transaction Signature',
  name: 'signature',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransaction'],
    },
  },
  default: '',
  description: 'The transaction signature (base58 encoded)',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransaction', 'simulateTransaction', 'getRecentBlockhash', 'getFeeForMessage'],
    },
  },
  options: [
    {
      name: 'Processed',
      value: 'processed',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
    },
    {
      name: 'Finalized',
      value: 'finalized',
    },
  ],
  default: 'confirmed',
  description: 'The commitment level for the transaction',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransaction', 'sendTransaction', 'simulateTransaction'],
    },
  },
  options: [
    {
      name: 'JSON',
      value: 'json',
    },
    {
      name: 'Base58',
      value: 'base58',
    },
    {
      name: 'Base64',
      value: 'base64',
    },
  ],
  default: 'json',
  description: 'The encoding format for the transaction data',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getSignaturesForAddress'],
    },
  },
  default: '',
  description: 'The account address (base58 encoded)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getSignaturesForAddress'],
    },
  },
  default: 1000,
  typeOptions: {
    minValue: 1,
    maxValue: 1000,
  },
  description: 'Maximum number of signatures to return',
},
{
  displayName: 'Before',
  name: 'before',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getSignaturesForAddress'],
    },
  },
  default: '',
  description: 'Start searching backwards from this transaction signature',
},
{
  displayName: 'Until',
  name: 'until',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getSignaturesForAddress'],
    },
  },
  default: '',
  description: 'Search until this transaction signature, if found before limit reached',
},
{
  displayName: 'Transaction',
  name: 'transaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['sendTransaction', 'simulateTransaction'],
    },
  },
  default: '',
  description: 'The transaction data (base58 or base64 encoded)',
},
{
  displayName: 'Message',
  name: 'message',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getFeeForMessage'],
    },
  },
  default: '',
  description: 'The message to calculate fee for (base64 encoded)',
},
{
  displayName: 'Token Account Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountBalance', 'getTokenAccountsByDelegate'],
    },
  },
  default: '',
  description: 'The public key of the token account or delegate',
},
{
  displayName: 'Mint Address',
  name: 'mint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenSupply', 'getTokenLargestAccounts'],
    },
  },
  default: '',
  description: 'The mint address of the token',
},
{
  displayName: 'Mint Address',
  name: 'mint',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountsByDelegate'],
    },
  },
  default: '',
  description: 'Optional mint address to filter token accounts',
},
{
  displayName: 'Program ID',
  name: 'programId',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountsByDelegate'],
    },
  },
  default: '',
  description: 'Optional program ID to filter token accounts',
},
{
  displayName: 'Data Length',
  name: 'dataLength',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getMinimumBalanceForRentExemption'],
    },
  },
  default: 0,
  description: 'The size of the account data in bytes',
},
{
  displayName: 'Commitment Level',
  name: 'commitment',
  type: 'options',
  required: false,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountBalance', 'getTokenSupply', 'getTokenLargestAccounts', 'getMinimumBalanceForRentExemption'],
    },
  },
  options: [
    {
      name: 'Finalized',
      value: 'finalized',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
    },
    {
      name: 'Processed',
      value: 'processed',
    },
  ],
  default: 'finalized',
  description: 'The commitment level for the request',
},
{
  displayName: 'Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getAccountInfo'],
    },
  },
  default: '',
  description: 'The NFT mint account public key (base58 encoded)',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getAccountInfo'],
    },
  },
  options: [
    {
      name: 'Processed',
      value: 'processed',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
    },
    {
      name: 'Finalized',
      value: 'finalized',
    },
  ],
  default: 'confirmed',
  description: 'The commitment level for the request',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getAccountInfo'],
    },
  },
  options: [
    {
      name: 'Base58',
      value: 'base58',
    },
    {
      name: 'Base64',
      value: 'base64',
    },
    {
      name: 'JSON Parsed',
      value: 'jsonParsed',
    },
  ],
  default: 'jsonParsed',
  description: 'The encoding format for account data',
},
{
  displayName: 'Owner Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getTokenAccountsByOwner'],
    },
  },
  default: '',
  description: 'The owner account public key (base58 encoded)',
},
{
  displayName: 'Mint',
  name: 'mint',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getTokenAccountsByOwner'],
    },
  },
  default: '',
  description: 'Filter by specific mint address (optional)',
},
{
  displayName: 'Program ID',
  name: 'programId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getTokenAccountsByOwner', 'getProgramAccounts'],
    },
  },
  default: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  description: 'The token program ID',
},
{
  displayName: 'Program Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getProgramAccounts'],
    },
  },
  default: '',
  description: 'The program account public key (base58 encoded)',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getProgramAccounts'],
    },
  },
  options: [
    {
      name: 'Processed',
      value: 'processed',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
    },
    {
      name: 'Finalized',
      value: 'finalized',
    },
  ],
  default: 'confirmed',
  description: 'The commitment level for the request',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getProgramAccounts'],
    },
  },
  default: '',
  description: 'JSON string of filters to apply to the request (optional)',
},
{
  displayName: 'Public Keys',
  name: 'pubkeys',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getMultipleAccounts'],
    },
  },
  default: '',
  description: 'Comma-separated list of account public keys (base58 encoded)',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getMultipleAccounts'],
    },
  },
  options: [
    {
      name: 'Processed',
      value: 'processed',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
    },
    {
      name: 'Finalized',
      value: 'finalized',
    },
  ],
  default: 'confirmed',
  description: 'The commitment level for the request',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getMultipleAccounts'],
    },
  },
  options: [
    {
      name: 'Base58',
      value: 'base58',
    },
    {
      name: 'Base64',
      value: 'base64',
    },
    {
      name: 'JSON Parsed',
      value: 'jsonParsed',
    },
  ],
  default: 'jsonParsed',
  description: 'The encoding format for account data',
},
{
  displayName: 'Mint',
  name: 'mint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getTokenSupply'],
    },
  },
  default: '',
  description: 'The NFT mint address to check supply for',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getTokenSupply'],
    },
  },
  options: [
    {
      name: 'Processed',
      value: 'processed',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
    },
    {
      name: 'Finalized',
      value: 'finalized',
    },
  ],
  default: 'confirmed',
  description: 'The commitment level for the request',
},
{
  displayName: 'Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakeActivation'],
    },
  },
  default: '',
  description: 'The stake account public key (base58 encoded)',
},
{
  displayName: 'Commitment Level',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakeActivation', 'getVoteAccounts', 'getInflationReward', 'getEpochInfo', 'getValidators', 'getDelegatedStake'],
    },
  },
  options: [
    {
      name: 'Processed',
      value: 'processed',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
    },
    {
      name: 'Finalized',
      value: 'finalized',
    },
  ],
  default: 'finalized',
  description: 'The commitment level for the query',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakeActivation', 'getInflationReward'],
    },
  },
  default: '',
  description: 'Epoch number (optional)',
},
{
  displayName: 'Vote Public Key',
  name: 'votePubkey',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getVoteAccounts'],
    },
  },
  default: '',
  description: 'Specific vote account public key to query (optional)',
},
{
  displayName: 'Account Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getInflationReward'],
    },
  },
  default: '',
  description: 'Comma-separated list of account addresses (base58 encoded)',
  placeholder: 'address1,address2,address3',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'token':
        return [await executeTokenOperations.call(this, items)];
      case 'nFT':
        return [await executeNFTOperations.call(this, items)];
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('solanaApi') as any;

  const baseUrl = credentials.baseUrl || 'https://api.mainnet-beta.solana.com';

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAccountInfo': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const body: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getAccountInfo',
            params: [
              pubkey,
              {
                commitment,
                encoding,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, { message: result.error.message });
          }

          result = result.result;
          break;
        }

        case 'getBalance': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;

          const body: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [
              pubkey,
              {
                commitment,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, { message: result.error.message });
          }

          result = result.result;
          break;
        }

        case 'getMultipleAccounts': {
          const pubkeys = this.getNodeParameter('pubkeys', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const pubkeyArray = pubkeys.split(',').map((pk: string) => pk.trim());

          const body: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getMultipleAccounts',
            params: [
              pubkeyArray,
              {
                commitment,
                encoding,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, { message: result.error.message });
          }

          result = result.result;
          break;
        }

        case 'getTokenAccountsByOwner': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const filterType = this.getNodeParameter('filterType', i) as string;
          
          let filter: any = {};
          if (filterType === 'mint') {
            const mint = this.getNodeParameter('mint', i) as string;
            filter = { mint };
          } else {
            const programId = this.getNodeParameter('programId', i) as string;
            filter = { programId };
          }

          const body: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [
              pubkey,
              filter,
              {
                commitment,
                encoding: 'jsonParsed',
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, { message: result.error.message });
          }

          result = result.result;
          break;
        }

        case 'getProgramAccounts': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const filtersStr = this.getNodeParameter('filters', i) as string;

          let filters: any[] = [];
          if (filtersStr) {
            try {
              filters = JSON.parse(filtersStr);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), 'Invalid JSON in filters parameter');
            }
          }

          const body: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getProgramAccounts',
            params: [
              pubkey,
              {
                commitment,
                encoding: 'base64',
                filters,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error, { message: result.error.message });
          }

          result = result.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('solanaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getTransaction': {
          const signature = this.getNodeParameter('signature', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'confirmed') as string;
          const encoding = this.getNodeParameter('encoding', i, 'json') as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTransaction',
            params: [
              signature,
              {
                encoding,
                commitment,
                maxSupportedTransactionVersion: 0,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getSignaturesForAddress': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 1000) as number;
          const before = this.getNodeParameter('before', i, '') as string;
          const until = this.getNodeParameter('until', i, '') as string;
          
          const params: any = {
            limit,
          };
          
          if (before) params.before = before;
          if (until) params.until = until;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getSignaturesForAddress',
            params: [address, params],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'sendTransaction': {
          const transaction = this.getNodeParameter('transaction', i) as string;
          const encoding = this.getNodeParameter('encoding', i, 'base58') as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'sendTransaction',
            params: [
              transaction,
              {
                encoding,
                skipPreflight: false,
                preflightCommitment: 'processed',
                maxRetries: 3,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'simulateTransaction': {
          const transaction = this.getNodeParameter('transaction', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'processed') as string;
          const encoding = this.getNodeParameter('encoding', i, 'base64') as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'simulateTransaction',
            params: [
              transaction,
              {
                encoding,
                commitment,
                replaceRecentBlockhash: true,
                sigVerify: false,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getRecentBlockhash': {
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getRecentBlockhash',
            params: [{ commitment }],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getFeeForMessage': {
          const message = this.getNodeParameter('message', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'processed') as string;
          
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getFeeForMessage',
            params: [message, { commitment }],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = JSON.parse(response);
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ 
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTokenOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('solanaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTokenAccountBalance': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountBalance',
            params: [pubkey, { commitment }],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error);
          }
          
          result = result.result;
          break;
        }

        case 'getTokenSupply': {
          const mint = this.getNodeParameter('mint', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenSupply',
            params: [mint, { commitment }],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error);
          }
          
          result = result.result;
          break;
        }

        case 'getTokenAccountsByDelegate': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const mint = this.getNodeParameter('mint', i, '') as string;
          const programId = this.getNodeParameter('programId', i, '') as string;

          const filters: any = {};
          if (mint) {
            filters.mint = mint;
          }
          if (programId) {
            filters.programId = programId;
          }

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByDelegate',
            params: [
              pubkey,
              filters,
              {
                encoding: 'jsonParsed',
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error);
          }
          
          result = result.result;
          break;
        }

        case 'getTokenLargestAccounts': {
          const mint = this.getNodeParameter('mint', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenLargestAccounts',
            params: [mint, { commitment }],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error);
          }
          
          result = result.result;
          break;
        }

        case 'getMinimumBalanceForRentExemption': {
          const dataLength = this.getNodeParameter('dataLength', i) as number;
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getMinimumBalanceForRentExemption',
            params: [dataLength, { commitment }],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          
          if (result.error) {
            throw new NodeApiError(this.getNode(), result.error);
          }
          
          result = result.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeNFTOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('solanaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAccountInfo': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'confirmed') as string;
          const encoding = this.getNodeParameter('encoding', i, 'jsonParsed') as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getAccountInfo',
            params: [
              pubkey,
              {
                commitment,
                encoding,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenAccountsByOwner': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const mint = this.getNodeParameter('mint', i, '') as string;
          const programId = this.getNodeParameter('programId', i, 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') as string;

          const filter: any = mint ? { mint } : { programId };

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [
              pubkey,
              filter,
              {
                encoding: 'jsonParsed',
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProgramAccounts': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'confirmed') as string;
          const filtersStr = this.getNodeParameter('filters', i, '') as string;

          let filters: any = [];
          if (filtersStr) {
            try {
              filters = JSON.parse(filtersStr);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), `Invalid filters JSON: ${error.message}`);
            }
          }

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getProgramAccounts',
            params: [
              pubkey,
              {
                commitment,
                encoding: 'jsonParsed',
                filters,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMultipleAccounts': {
          const pubkeysStr = this.getNodeParameter('pubkeys', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'confirmed') as string;
          const encoding = this.getNodeParameter('encoding', i, 'jsonParsed') as string;

          const pubkeys = pubkeysStr.split(',').map((key: string) => key.trim());

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getMultipleAccounts',
            params: [
              pubkeys,
              {
                commitment,
                encoding,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenSupply': {
          const mint = this.getNodeParameter('mint', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'confirmed') as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenSupply',
            params: [
              mint,
              {
                commitment,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      if (result.error) {
        throw new NodeApiError(this.getNode(), result.error);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeStakingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('solanaApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://api.mainnet-beta.solana.com';

      switch (operation) {
        case 'getStakeActivation': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const epoch = this.getNodeParameter('epoch', i) as number;

          const params: any = {
            commitment,
          };

          if (epoch) {
            params.epoch = epoch;
          }

          const rpcParams = [pubkey, params];

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getStakeActivation',
            params: rpcParams,
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: requestBody,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVoteAccounts': {
          const commitment = this.getNodeParameter('commitment', i) as string;
          const votePubkey = this.getNodeParameter('votePubkey', i) as string;

          const params: any = {
            commitment,
          };

          if (votePubkey) {
            params.votePubkey = votePubkey;
          }

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getVoteAccounts',
            params: [params],
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: requestBody,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getInflationReward': {
          const addressesStr = this.getNodeParameter('addresses', i) as string;
          const epoch = this.getNodeParameter('epoch', i) as number;
          const commitment = this.getNodeParameter('commitment', i) as string;

          const addresses = addressesStr.split(',').map((addr: string) => addr.trim());

          const params: any = [addresses];
          
          const configParams: any = {
            commitment,
          };

          if (epoch) {
            configParams.epoch = epoch;
          }

          params.push(configParams);

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getInflationReward',
            params: params,
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: requestBody,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEpochInfo': {
          const commitment = this.getNodeParameter('commitment', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getEpochInfo',
            params: [{ commitment }],
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: requestBody,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getValidators': {
          const commitment = this.getNodeParameter('commitment', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getClusterNodes',
            params: [{ commitment }],
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: requestBody,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDelegatedStake': {
          const commitment = this.getNodeParameter('commitment', i) as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getVoteAccounts',
            params: [{ commitment }],
          };

          const options: any = {
            method: 'POST',
            url: baseUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
            body: requestBody,
          };

          if (credentials.apiKey) {
            options.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
          }

          const voteAccountsResult = await this.helpers.httpRequest(options) as any;
          
          // Calculate delegated stake from vote accounts
          const delegatedStakeInfo = calculateDelegatedStake(voteAccountsResult);
          result = {
            jsonrpc: '2.0',
            id: 1,
            result: delegatedStakeInfo,
          };
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

function calculateDelegatedStake(voteAccountsResponse: any): any {
  if (!voteAccountsResponse?.result) {
    return { totalDelegatedStake: 0, validators: [] };
  }

  const current = voteAccountsResponse.result.current || [];
  const delinquent = voteAccountsResponse.result.delinquent || [];
  
  const allValidators = [...current, ...delinquent];
  
  const totalDelegatedStake = allValidators.reduce((sum: number, validator: any) => {
    return sum + (validator.activatedStake || 0);
  }, 0);

  const validatorStakes = allValidators.map((validator: any) => ({
    votePubkey: validator.votePubkey,
    nodePubkey: validator.nodePubkey,
    activatedStake: validator.activatedStake || 0,
    commission: validator.commission,
  }));

  return {
    totalDelegatedStake,
    validatorCount: allValidators.length,
    validators: validatorStakes,
  };
}
