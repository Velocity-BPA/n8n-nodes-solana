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
            name: 'Block',
            value: 'block',
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
      description: 'Get account information and data',
      action: 'Get account info',
    },
    {
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get account balance in lamports',
      action: 'Get balance',
    },
    {
      name: 'Get Program Accounts',
      value: 'getProgramAccounts',
      description: 'Get accounts owned by a program',
      action: 'Get program accounts',
    },
    {
      name: 'Get Multiple Accounts',
      value: 'getMultipleAccounts',
      description: 'Get multiple account information',
      action: 'Get multiple accounts',
    },
    {
      name: 'Get Largest Accounts',
      value: 'getLargestAccounts',
      description: 'Get largest accounts by balance',
      action: 'Get largest accounts',
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
      action: 'Get transaction details',
    },
    {
      name: 'Get Confirmed Transaction',
      value: 'getConfirmedTransaction',
      description: 'Get confirmed transaction details',
      action: 'Get confirmed transaction details',
    },
    {
      name: 'Send Transaction',
      value: 'sendTransaction',
      description: 'Submit a transaction to the network',
      action: 'Send transaction to network',
    },
    {
      name: 'Simulate Transaction',
      value: 'simulateTransaction',
      description: 'Simulate a transaction',
      action: 'Simulate transaction',
    },
    {
      name: 'Get Signatures For Address',
      value: 'getSignaturesForAddress',
      description: 'Get transaction signatures for an address',
      action: 'Get signatures for address',
    },
    {
      name: 'Get Recent Blockhash',
      value: 'getRecentBlockhash',
      description: 'Get recent blockhash for transactions',
      action: 'Get recent blockhash',
    },
    {
      name: 'Get Fee For Message',
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
      description: 'Get the balance of a token account',
      action: 'Get token account balance',
    },
    {
      name: 'Get Token Accounts By Owner',
      value: 'getTokenAccountsByOwner',
      description: 'Get all token accounts owned by a specific address',
      action: 'Get token accounts by owner',
    },
    {
      name: 'Get Token Accounts By Delegate',
      value: 'getTokenAccountsByDelegate',
      description: 'Get all token accounts delegated to a specific address',
      action: 'Get token accounts by delegate',
    },
    {
      name: 'Get Token Supply',
      value: 'getTokenSupply',
      description: 'Get the total supply of a token',
      action: 'Get token supply',
    },
    {
      name: 'Get Token Largest Accounts',
      value: 'getTokenLargestAccounts',
      description: 'Get the largest accounts for a token',
      action: 'Get token largest accounts',
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
      resource: ['block'],
    },
  },
  options: [
    {
      name: 'Get Block',
      value: 'getBlock',
      description: 'Get block information for a given slot',
      action: 'Get block information',
    },
    {
      name: 'Get Blocks',
      value: 'getBlocks',
      description: 'Get list of blocks between slots',
      action: 'Get list of blocks',
    },
    {
      name: 'Get Block Height',
      value: 'getBlockHeight',
      description: 'Get current block height',
      action: 'Get current block height',
    },
    {
      name: 'Get Slot',
      value: 'getSlot',
      description: 'Get current slot',
      action: 'Get current slot',
    },
    {
      name: 'Get Epoch Info',
      value: 'getEpochInfo',
      description: 'Get epoch information',
      action: 'Get epoch information',
    },
    {
      name: 'Get Block Time',
      value: 'getBlockTime',
      description: 'Get estimated time of a block',
      action: 'Get block time',
    },
  ],
  default: 'getBlock',
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
      description: 'Get stake activation state for a stake account',
      action: 'Get stake activation state',
    },
    {
      name: 'Get Vote Accounts',
      value: 'getVoteAccounts',
      description: 'Get vote accounts and validator information',
      action: 'Get vote accounts',
    },
    {
      name: 'Get Inflation Reward',
      value: 'getInflationReward',
      description: 'Get inflation rewards for addresses',
      action: 'Get inflation rewards',
    },
    {
      name: 'Get Inflation Rate',
      value: 'getInflationRate',
      description: 'Get current inflation rate',
      action: 'Get inflation rate',
    },
    {
      name: 'Get Inflation Governor',
      value: 'getInflationGovernor',
      description: 'Get inflation governor parameters',
      action: 'Get inflation governor',
    },
    {
      name: 'Get Epoch Schedule',
      value: 'getEpochSchedule',
      description: 'Get epoch schedule information',
      action: 'Get epoch schedule',
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
      operation: ['getAccountInfo', 'getBalance'],
    },
  },
  default: '',
  description: 'The account public key encoded in base-58',
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
  description: 'Comma-separated list of account public keys encoded in base-58',
},
{
  displayName: 'Program ID',
  name: 'programId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getProgramAccounts'],
    },
  },
  default: '',
  description: 'The program ID that owns the accounts',
},
{
  displayName: 'Commitment Level',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['account'],
    },
  },
  options: [
    {
      name: 'Processed',
      value: 'processed',
      description: 'Query the most recent block which has reached 1 confirmation',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
      description: 'Query the most recent block which has reached confirmation by the cluster',
    },
    {
      name: 'Finalized',
      value: 'finalized',
      description: 'Query the most recent block which has been finalized by the cluster',
    },
  ],
  default: 'finalized',
  description: 'The commitment level to use',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getAccountInfo', 'getProgramAccounts', 'getMultipleAccounts'],
    },
  },
  options: [
    {
      name: 'Base58',
      value: 'base58',
      description: 'Limited to account data of less than 129 bytes',
    },
    {
      name: 'Base64',
      value: 'base64',
      description: 'Account data encoded using base64',
    },
    {
      name: 'Base64+Zstd',
      value: 'base64+zstd',
      description: 'Account data compressed with Zstd and encoded using base64',
    },
    {
      name: 'JSON Parsed',
      value: 'jsonParsed',
      description: 'Account data is parsed according to the account\'s owner program',
    },
  ],
  default: 'base64',
  description: 'Encoding format for account data',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getProgramAccounts'],
    },
  },
  default: '[]',
  description: 'JSON array of filter objects to use when requesting program accounts',
},
{
  displayName: 'Filter',
  name: 'filter',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getLargestAccounts'],
    },
  },
  options: [
    {
      name: 'Circulating',
      value: 'circulating',
      description: 'Filter out non-circulating accounts',
    },
    {
      name: 'Non-Circulating',
      value: 'nonCirculating',
      description: 'Filter out circulating accounts',
    },
  ],
  default: 'circulating',
  description: 'Filter to apply when retrieving largest accounts',
},
{
  displayName: 'Signature',
  name: 'signature',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransaction', 'getConfirmedTransaction'],
    },
  },
  default: '',
  description: 'Transaction signature as base58 encoded string',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransaction', 'simulateTransaction', 'getSignaturesForAddress', 'getRecentBlockhash', 'getFeeForMessage'],
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
  description: 'Commitment level for the request',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransaction', 'getConfirmedTransaction', 'sendTransaction', 'simulateTransaction'],
    },
  },
  options: [
    {
      name: 'JSON',
      value: 'json',
    },
    {
      name: 'JSON Parsed',
      value: 'jsonParsed',
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
  description: 'Encoding format for the response',
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
  description: 'Fully-signed Transaction, as encoded string',
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
  description: 'Account address as base58 encoded string',
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
  description: 'Maximum transaction signatures to return (between 1 and 1,000)',
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
  description: 'Base64 encoded message for which to get the fee',
},
{
  displayName: 'Token Account Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountBalance'],
    },
  },
  default: '',
  description: 'The public key of the token account',
},
{
  displayName: 'Owner Public Key',
  name: 'owner',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountsByOwner'],
    },
  },
  default: '',
  description: 'The public key of the token account owner',
},
{
  displayName: 'Delegate Public Key',
  name: 'delegate',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountsByDelegate'],
    },
  },
  default: '',
  description: 'The public key of the delegate',
},
{
  displayName: 'Mint Public Key',
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
  description: 'The public key of the token mint',
},
{
  displayName: 'Filter By Mint',
  name: 'filterByMint',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountsByOwner', 'getTokenAccountsByDelegate'],
    },
  },
  default: false,
  description: 'Whether to filter by a specific mint address',
},
{
  displayName: 'Mint Address',
  name: 'mintAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountsByOwner', 'getTokenAccountsByDelegate'],
      filterByMint: [true],
    },
  },
  default: '',
  description: 'The mint address to filter by',
},
{
  displayName: 'Program ID',
  name: 'programId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountsByOwner', 'getTokenAccountsByDelegate'],
      filterByMint: [false],
    },
  },
  default: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  description: 'The program ID to filter by (default is SPL Token program)',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountBalance', 'getTokenAccountsByOwner', 'getTokenAccountsByDelegate', 'getTokenSupply', 'getTokenLargestAccounts'],
    },
  },
  options: [
    {
      name: 'Processed',
      value: 'processed',
      description: 'Query the most recent block which has reached 1 confirmation',
    },
    {
      name: 'Confirmed',
      value: 'confirmed',
      description: 'Query the most recent block which has reached 1 confirmation by the connected node',
    },
    {
      name: 'Finalized',
      value: 'finalized',
      description: 'Query the most recent block which has been finalized by the cluster',
    },
  ],
  default: 'confirmed',
  description: 'The commitment level to use',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountsByOwner', 'getTokenAccountsByDelegate'],
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
      name: 'Base64+Zstd',
      value: 'base64+zstd',
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
  displayName: 'Slot',
  name: 'slot',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlock'],
    },
  },
  default: 0,
  description: 'The slot of the block to retrieve',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlock'],
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
  description: 'Commitment level for the query',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlock'],
    },
  },
  options: [
    {
      name: 'JSON',
      value: 'json',
    },
    {
      name: 'JSON Parsed',
      value: 'jsonParsed',
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
  description: 'Encoding for transaction data',
},
{
  displayName: 'Transaction Details',
  name: 'transactionDetails',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlock'],
    },
  },
  options: [
    {
      name: 'Full',
      value: 'full',
    },
    {
      name: 'Accounts',
      value: 'accounts',
    },
    {
      name: 'Signatures',
      value: 'signatures',
    },
    {
      name: 'None',
      value: 'none',
    },
  ],
  default: 'full',
  description: 'Level of transaction detail to return',
},
{
  displayName: 'Include Rewards',
  name: 'rewards',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlock'],
    },
  },
  default: true,
  description: 'Whether to populate rewards array',
},
{
  displayName: 'Start Slot',
  name: 'startSlot',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlocks'],
    },
  },
  default: 0,
  description: 'Start slot for the range',
},
{
  displayName: 'End Slot',
  name: 'endSlot',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlocks'],
    },
  },
  default: 0,
  description: 'End slot for the range (optional)',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlocks'],
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
  description: 'Commitment level for the query',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlockHeight'],
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
  description: 'Commitment level for the query',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getSlot'],
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
  description: 'Commitment level for the query',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getEpochInfo'],
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
  description: 'Commitment level for the query',
},
{
  displayName: 'Slot',
  name: 'slot',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlockTime'],
    },
  },
  default: 0,
  description: 'The slot of the block to get time for',
},
{
  displayName: 'Stake Account Public Key',
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
  description: 'Public key of the stake account to query',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakeActivation', 'getVoteAccounts', 'getInflationReward', 'getInflationGovernor'],
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
  description: 'Commitment level to use for the request',
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
  description: 'Epoch for which to fetch the activation/reward. If omitted, the stake activation/reward for the current epoch is fetched',
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
  description: 'Only return results for this validator vote address',
},
{
  displayName: 'Keep Unstaked Delinquents',
  name: 'keepUnstakedDelinquents',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getVoteAccounts'],
    },
  },
  default: false,
  description: 'Do not filter out delinquent validators with no stake',
},
{
  displayName: 'Addresses',
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
  description: 'Comma-separated list of addresses to query for inflation rewards',
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
      case 'block':
        return [await executeBlockOperations.call(this, items)];
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

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAccountInfo': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

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
            body: requestBody,
            json: true,
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

          const requestBody: any = {
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
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
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
          const programId = this.getNodeParameter('programId', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;
          const filtersString = this.getNodeParameter('filters', i) as string;

          let filters: any[] = [];
          try {
            filters = JSON.parse(filtersString);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid filters JSON: ${error.message}`);
          }

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getProgramAccounts',
            params: [
              programId,
              {
                commitment,
                encoding,
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
            body: requestBody,
            json: true,
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
          const pubkeysString = this.getNodeParameter('pubkeys', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const pubkeys = pubkeysString.split(',').map((key: string) => key.trim());

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
            body: requestBody,
            json: true,
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

        case 'getLargestAccounts': {
          const commitment = this.getNodeParameter('commitment', i) as string;
          const filter = this.getNodeParameter('filter', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getLargestAccounts',
            params: [
              {
                commitment,
                filter,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
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
      const rpcUrl = credentials.rpcUrl || 'https://api.mainnet-beta.solana.com';

      switch (operation) {
        case 'getTransaction': {
          const signature = this.getNodeParameter('signature', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTransaction',
            params: [
              signature,
              {
                encoding,
                commitment,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: rpcUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getConfirmedTransaction': {
          const signature = this.getNodeParameter('signature', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getConfirmedTransaction',
            params: [
              signature,
              encoding,
            ],
          };

          const options: any = {
            method: 'POST',
            url: rpcUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'sendTransaction': {
          const transaction = this.getNodeParameter('transaction', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'sendTransaction',
            params: [
              transaction,
              {
                encoding,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: rpcUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateTransaction': {
          const transaction = this.getNodeParameter('transaction', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'simulateTransaction',
            params: [
              transaction,
              {
                encoding,
                commitment,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: rpcUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSignaturesForAddress': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const before = this.getNodeParameter('before', i) as string;
          const until = this.getNodeParameter('until', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;

          const params: any = [
            address,
            {
              limit,
              commitment,
            },
          ];

          if (before) {
            params[1].before = before;
          }

          if (until) {
            params[1].until = until;
          }

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getSignaturesForAddress',
            params,
          };

          const options: any = {
            method: 'POST',
            url: rpcUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRecentBlockhash': {
          const commitment = this.getNodeParameter('commitment', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getRecentBlockhash',
            params: [
              {
                commitment,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: rpcUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFeeForMessage': {
          const message = this.getNodeParameter('message', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getFeeForMessage',
            params: [
              message,
              {
                commitment,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: rpcUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          };

          result = await this.helpers.httpRequest(options) as any;
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
        throw new NodeApiError(this.getNode(), error);
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
      const commitment = this.getNodeParameter('commitment', i, 'confirmed') as string;

      switch (operation) {
        case 'getTokenAccountBalance': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          
          const requestBody = {
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
            body: requestBody,
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenAccountsByOwner': {
          const owner = this.getNodeParameter('owner', i) as string;
          const filterByMint = this.getNodeParameter('filterByMint', i, false) as boolean;
          const encoding = this.getNodeParameter('encoding', i, 'jsonParsed') as string;
          
          let filter: any;
          if (filterByMint) {
            const mintAddress = this.getNodeParameter('mintAddress', i) as string;
            filter = { mint: mintAddress };
          } else {
            const programId = this.getNodeParameter('programId', i, 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') as string;
            filter = { programId };
          }

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [
              owner,
              filter,
              {
                encoding,
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
            body: requestBody,
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenAccountsByDelegate': {
          const delegate = this.getNodeParameter('delegate', i) as string;
          const filterByMint = this.getNodeParameter('filterByMint', i, false) as boolean;
          const encoding = this.getNodeParameter('encoding', i, 'jsonParsed') as string;
          
          let filter: any;
          if (filterByMint) {
            const mintAddress = this.getNodeParameter('mintAddress', i) as string;
            filter = { mint: mintAddress };
          } else {
            const programId = this.getNodeParameter('programId', i, 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') as string;
            filter = { programId };
          }

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByDelegate',
            params: [
              delegate,
              filter,
              {
                encoding,
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
            body: requestBody,
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenSupply': {
          const mint = this.getNodeParameter('mint', i) as string;
          
          const requestBody = {
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
            body: requestBody,
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenLargestAccounts': {
          const mint = this.getNodeParameter('mint', i) as string;
          
          const requestBody = {
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
            body: requestBody,
            json: true,
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
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
        json: result.result || result, 
        pairedItem: { item: i } 
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBlockOperations(
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
        case 'getBlock': {
          const slot = this.getNodeParameter('slot', i) as number;
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;
          const encoding = this.getNodeParameter('encoding', i, 'json') as string;
          const transactionDetails = this.getNodeParameter('transactionDetails', i, 'full') as string;
          const rewards = this.getNodeParameter('rewards', i, true) as boolean;

          const params: any[] = [slot];
          const config: any = {
            commitment,
            encoding,
            transactionDetails,
            rewards,
          };
          params.push(config);

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getBlock',
            params,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlocks': {
          const startSlot = this.getNodeParameter('startSlot', i) as number;
          const endSlot = this.getNodeParameter('endSlot', i, null) as number | null;
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;

          const params: any[] = [startSlot];
          if (endSlot !== null && endSlot > 0) {
            params.push(endSlot);
          }
          params.push({ commitment });

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getBlocks',
            params,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockHeight': {
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getBlockHeight',
            params: [{ commitment }],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getSlot': {
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getSlot',
            params: [{ commitment }],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getEpochInfo': {
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getEpochInfo',
            params: [{ commitment }],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockTime': {
          const slot = this.getNodeParameter('slot', i) as number;

          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getBlockTime',
            params: [slot],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      if (result.error) {
        throw new NodeApiError(this.getNode(), result.error, {
          message: result.error.message,
          description: `Solana RPC error: ${result.error.message}`,
        });
      }

      returnData.push({
        json: result.result || result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error instanceof NodeApiError || error instanceof NodeOperationError) {
          throw error;
        }
        throw new NodeApiError(this.getNode(), error, {
          message: error.message,
          description: `Failed to execute ${operation} operation`,
        });
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

      const baseOptions: any = {
        method: 'POST',
        url: credentials.baseUrl || 'https://api.mainnet-beta.solana.com',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      };

      if (credentials.apiKey) {
        baseOptions.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
      }

      switch (operation) {
        case 'getStakeActivation': {
          const pubkey = this.getNodeParameter('pubkey', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;
          const epoch = this.getNodeParameter('epoch', i) as number;

          const params: any = [pubkey];
          const config: any = {};

          if (commitment) {
            config.commitment = commitment;
          }

          if (epoch !== undefined && epoch !== '') {
            config.epoch = epoch;
          }

          if (Object.keys(config).length > 0) {
            params.push(config);
          }

          const requestOptions = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              id: 1,
              method: 'getStakeActivation',
              params,
            },
          };

          const response = await this.helpers.httpRequest(requestOptions) as any;

          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error);
          }

          result = response.result;
          break;
        }

        case 'getVoteAccounts': {
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;
          const votePubkey = this.getNodeParameter('votePubkey', i) as string;
          const keepUnstakedDelinquents = this.getNodeParameter('keepUnstakedDelinquents', i, false) as boolean;

          const config: any = {};

          if (commitment) {
            config.commitment = commitment;
          }

          if (votePubkey) {
            config.votePubkey = votePubkey;
          }

          if (keepUnstakedDelinquents) {
            config.keepUnstakedDelinquents = keepUnstakedDelinquents;
          }

          const params: any[] = Object.keys(config).length > 0 ? [config] : [];

          const requestOptions = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              id: 1,
              method: 'getVoteAccounts',
              params,
            },
          };

          const response = await this.helpers.httpRequest(requestOptions) as any;

          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error);
          }

          result = response.result;
          break;
        }

        case 'getInflationReward': {
          const addressesInput = this.getNodeParameter('addresses', i) as string;
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;
          const epoch = this.getNodeParameter('epoch', i) as number;

          const addresses = addressesInput.split(',').map((addr: string) => addr.trim());

          const params: any = [addresses];
          const config: any = {};

          if (commitment) {
            config.commitment = commitment;
          }

          if (epoch !== undefined && epoch !== '') {
            config.epoch = epoch;
          }

          if (Object.keys(config).length > 0) {
            params.push(config);
          }

          const requestOptions = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              id: 1,
              method: 'getInflationReward',
              params,
            },
          };

          const response = await this.helpers.httpRequest(requestOptions) as any;

          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error);
          }

          result = response.result;
          break;
        }

        case 'getInflationRate': {
          const requestOptions = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              id: 1,
              method: 'getInflationRate',
              params: [],
            },
          };

          const response = await this.helpers.httpRequest(requestOptions) as any;

          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error);
          }

          result = response.result;
          break;
        }

        case 'getInflationGovernor': {
          const commitment = this.getNodeParameter('commitment', i, 'finalized') as string;

          const config: any = {};

          if (commitment) {
            config.commitment = commitment;
          }

          const params: any[] = Object.keys(config).length > 0 ? [config] : [];

          const requestOptions = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              id: 1,
              method: 'getInflationGovernor',
              params,
            },
          };

          const response = await this.helpers.httpRequest(requestOptions) as any;

          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error);
          }

          result = response.result;
          break;
        }

        case 'getEpochSchedule': {
          const requestOptions = {
            ...baseOptions,
            body: {
              jsonrpc: '2.0',
              id: 1,
              method: 'getEpochSchedule',
              params: [],
            },
          };

          const response = await this.helpers.httpRequest(requestOptions) as any;

          if (response.error) {
            throw new NodeApiError(this.getNode(), response.error);
          }

          result = response.result;
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
