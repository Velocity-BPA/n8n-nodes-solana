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
            name: 'Block',
            value: 'block',
          },
          {
            name: 'Token',
            value: 'token',
          },
          {
            name: 'Nft',
            value: 'nft',
          },
          {
            name: 'Program',
            value: 'program',
          },
          {
            name: 'Validator',
            value: 'validator',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Account Info', value: 'getAccountInfo', description: 'Get account data and executable status', action: 'Get account info' },
    { name: 'Get Balance', value: 'getBalance', description: 'Get lamport balance of an account', action: 'Get balance' },
    { name: 'Get Multiple Accounts', value: 'getMultipleAccounts', description: 'Get data for multiple accounts', action: 'Get multiple accounts' },
    { name: 'Get Program Accounts', value: 'getProgramAccounts', description: 'Get accounts owned by a program', action: 'Get program accounts' },
    { name: 'Get Token Accounts By Owner', value: 'getTokenAccountsByOwner', description: 'Get SPL token accounts by owner', action: 'Get token accounts by owner' },
    { name: 'Get Largest Accounts', value: 'getLargestAccounts', description: 'Get largest accounts by balance', action: 'Get largest accounts' },
  ],
  default: 'getAccountInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Send Transaction', value: 'sendTransaction', description: 'Submit a signed transaction to the network', action: 'Send a transaction' },
    { name: 'Simulate Transaction', value: 'simulateTransaction', description: 'Simulate transaction execution without submitting', action: 'Simulate a transaction' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details by signature', action: 'Get transaction details' },
    { name: 'Get Signatures for Address', value: 'getSignaturesForAddress', description: 'Get transaction signatures for an address', action: 'Get signatures for address' },
    { name: 'Get Confirmed Transaction', value: 'getConfirmedTransaction', description: 'Get confirmed transaction details', action: 'Get confirmed transaction' },
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
  default: 'sendTransaction',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['block'] } },
	options: [
		{
			name: 'Get Block',
			value: 'getBlock',
			description: 'Get block data by slot number',
			action: 'Get block data',
		},
		{
			name: 'Get Blocks',
			value: 'getBlocks',
			description: 'Get list of confirmed blocks',
			action: 'Get list of blocks',
		},
		{
			name: 'Get Slot',
			value: 'getSlot',
			description: 'Get current slot number',
			action: 'Get current slot',
		},
		{
			name: 'Get Block Height',
			value: 'getBlockHeight',
			description: 'Get current block height',
			action: 'Get block height',
		},
		{
			name: 'Get Epoch Info',
			value: 'getEpochInfo',
			description: 'Get current epoch information',
			action: 'Get epoch information',
		},
    {
      name: 'Get Block Time',
      value: 'getBlockTime',
      description: 'Get estimated time of a block',
      action: 'Get block time',
    },
    {
			name: 'Get Cluster Nodes',
			value: 'getClusterNodes',
			description: 'Get cluster node information',
			action: 'Get cluster node information',
		},
	],
	default: 'getBlock',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['token'] } },
  options: [
    { name: 'Get Token Supply', value: 'getTokenSupply', description: 'Get total supply of an SPL token', action: 'Get token supply' },
    { name: 'Get Token Account Balance', value: 'getTokenAccountBalance', description: 'Get token account balance', action: 'Get token account balance' },
    { name: 'Get Token Accounts By Delegate', value: 'getTokenAccountsByDelegate', description: 'Get token accounts by delegate', action: 'Get token accounts by delegate' },
    { name: 'Get Token Largest Accounts', value: 'getTokenLargestAccounts', description: 'Get largest token holders', action: 'Get token largest accounts' },
  ],
  default: 'getTokenSupply',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['nft'] } },
  options: [
    {
      name: 'Get NFT Metadata',
      value: 'getAccountInfo',
      description: 'Get NFT metadata account info',
      action: 'Get NFT metadata account info'
    },
    {
      name: 'Get NFTs by Creator/Owner',
      value: 'getProgramAccounts',
      description: 'Get NFTs by creator or owner using metadata program',
      action: 'Get NFTs by creator or owner'
    },
    {
      name: 'Get Multiple NFT Accounts',
      value: 'getMultipleAccounts',
      description: 'Get multiple NFT metadata accounts',
      action: 'Get multiple NFT metadata accounts'
    }
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
			resource: ['program'],
		},
	},
	options: [
		{
			name: 'Get Program Accounts',
			value: 'getProgramAccounts',
			description: 'Get all accounts owned by a program',
			action: 'Get program accounts',
		},
		{
			name: 'Get Account Info',
			value: 'getAccountInfo',
			description: 'Get program account information',
			action: 'Get account info',
		},
	],
	default: 'getProgramAccounts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['validator'],
    },
  },
  options: [
    {
      name: 'Get Vote Accounts',
      value: 'getVoteAccounts',
      description: 'Get vote accounts and staking info',
      action: 'Get vote accounts',
    },
    {
      name: 'Get Stake Activation',
      value: 'getStakeActivation',
      description: 'Get stake account activation status',
      action: 'Get stake activation',
    },
    {
      name: 'Get Inflation Rate',
      value: 'getInflationRate',
      description: 'Get current inflation rate',
      action: 'Get inflation rate',
    },
    {
      name: 'Get Inflation Reward',
      value: 'getInflationReward',
      description: 'Get inflation rewards for addresses',
      action: 'Get inflation reward',
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
  default: 'getVoteAccounts',
},
{
  displayName: 'Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getAccountInfo', 'getBalance'] } },
  default: '',
  description: 'Base58 encoded public key of the account',
},
{
  displayName: 'Public Keys',
  name: 'pubkeys',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getMultipleAccounts'] } },
  default: '',
  description: 'Comma-separated list of base58 encoded public keys (max 100)',
},
{
  displayName: 'Program ID',
  name: 'programId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getProgramAccounts'] } },
  default: '',
  description: 'Base58 encoded public key of the program',
},
{
  displayName: 'Owner',
  name: 'owner',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getTokenAccountsByOwner'] } },
  default: '',
  description: 'Base58 encoded public key of the account owner',
},
{
  displayName: 'Mint',
  name: 'mint',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['getTokenAccountsByOwner'] } },
  default: '',
  description: 'Base58 encoded public key of the SPL Token mint',
},
{
  displayName: 'Token Program ID',
  name: 'tokenProgramId',
  type: 'string',
  displayOptions: { show: { resource: ['account'], operation: ['getTokenAccountsByOwner'] } },
  default: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  description: 'Base58 encoded public key of the SPL Token program',
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
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Finalized', value: 'finalized', description: 'Highest slot confirmed by supermajority' },
    { name: 'Confirmed', value: 'confirmed', description: 'Slot confirmed by supermajority' },
    { name: 'Processed', value: 'processed', description: 'Most recent slot processed by validator' },
  ],
  default: 'finalized',
  description: 'Commitment level for querying state',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: { show: { resource: ['account'], operation: ['getAccountInfo', 'getMultipleAccounts', 'getProgramAccounts', 'getTokenAccountsByOwner'] } },
  options: [
    { name: 'Base58', value: 'base58', description: 'Base58 encoding' },
    { name: 'Base64', value: 'base64', description: 'Base64 encoding' },
    { name: 'Base64+Zstd', value: 'base64+zstd', description: 'Base64 encoding with Zstd compression' },
    { name: 'JSON Parsed', value: 'jsonParsed', description: 'JSON parsed data for known account types' },
  ],
  default: 'base64',
  description: 'Encoding format for account data',
},
{
  displayName: 'Filters',
  name: 'filters',
  type: 'json',
  displayOptions: { show: { resource: ['account'], operation: ['getProgramAccounts'] } },
  default: '[]',
  description: 'JSON array of filter objects to apply',
},
{
  displayName: 'Transaction',
  name: 'transaction',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction', 'simulateTransaction'] } },
  default: '',
  description: 'Signed transaction data as base64 or base58 string',
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  options: [
    { name: 'Base58', value: 'base58' },
    { name: 'Base64', value: 'base64' },
    { name: 'JSON', value: 'json' },
    { name: 'JSON Parsed', value: 'jsonParsed' },
  ],
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction', 'simulateTransaction', 'getTransaction', 'getConfirmedTransaction'] } },
  default: 'base64',
  description: 'Encoding format for the transaction data',
},
{
  displayName: 'Skip Preflight',
  name: 'skipPreflight',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction'] } },
  default: false,
  description: 'Skip the preflight transaction checks',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  options: [
    { name: 'Processed', value: 'processed' },
    { name: 'Confirmed', value: 'confirmed' },
    { name: 'Finalized', value: 'finalized' }
  ],
  displayOptions: { show: { resource: ['transaction'], operation: ['sendTransaction', 'simulateTransaction', 'getTransaction', 'getSignaturesForAddress', 'getConfirmedTransaction', 'getRecentBlockhash', 'getFeeForMessage'] } },
  default: 'finalized',
  description: 'Commitment level for querying the state',
},
{
  displayName: 'Signature Verification',
  name: 'sigVerify',
  type: 'boolean',
  displayOptions: { show: { resource: ['transaction'], operation: ['simulateTransaction'] } },
  default: false,
  description: 'Enable signature verification',
},
{
  displayName: 'Transaction Signature',
  name: 'signature',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getTransaction', 'getConfirmedTransaction'] } },
  default: '',
  description: 'Transaction signature as base58 string',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['transaction'], operation: ['getSignaturesForAddress'] } },
  default: '',
  description: 'Account address as base58 string',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['transaction'], operation: ['getSignaturesForAddress'] } },
  default: 1000,
  typeOptions: { minValue: 1, maxValue: 1000 },
  description: 'Maximum number of signatures to return',
},
{
  displayName: 'Before',
  name: 'before',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['getSignaturesForAddress'] } },
  default: '',
  description: 'Start searching backwards from this transaction signature',
},
{
  displayName: 'Until',
  name: 'until',
  type: 'string',
  displayOptions: { show: { resource: ['transaction'], operation: ['getSignaturesForAddress'] } },
  default: '',
  description: 'Search until this transaction signature',
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
	displayName: 'Slot Number',
	name: 'slot',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['block'],
			operation: ['getBlock', 'getBlockTime'],
		},
	},
	default: 0,
	description: 'The slot number of the block to retrieve',
},
{
	displayName: 'Commitment Level',
	name: 'commitment',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['block'],
			operation: ['getBlock', 'getBlocks', 'getSlot', 'getBlockHeight', 'getEpochInfo'],
		},
	},
	options: [
		{
			name: 'Finalized',
			value: 'finalized',
			description: 'The node will query the most recent block confirmed by supermajority',
		},
		{
			name: 'Confirmed',
			value: 'confirmed',
			description: 'The node will query the most recent block that has been voted on by supermajority',
		},
		{
			name: 'Processed',
			value: 'processed',
			description: 'The node will query its most recent block',
		},
	],
	default: 'finalized',
	description: 'Commitment level for data consistency',
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
			description: 'JSON encoding',
		},
		{
			name: 'JSON Parsed',
			value: 'jsonParsed',
			description: 'JSON encoding with parsed transaction data',
		},
		{
			name: 'Base58',
			value: 'base58',
			description: 'Base58 encoding',
		},
		{
			name: 'Base64',
			value: 'base64',
			description: 'Base64 encoding',
		},
	],
	default: 'json',
	description: 'Encoding format for the response',
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
			description: 'Populate the transactions field',
		},
		{
			name: 'Signatures',
			value: 'signatures',
			description: 'Only return the transaction signatures',
		},
		{
			name: 'None',
			value: 'none',
			description: 'Exclude the transactions field',
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
	description: 'Start slot number for the range of blocks',
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
	description: 'End slot number for the range of blocks (optional)',
},
{
  displayName: 'Mint Address',
  name: 'mint',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenSupply', 'getTokenAccountsByDelegate', 'getTokenLargestAccounts'],
    },
  },
  default: '',
  description: 'The mint address of the SPL token',
},
{
  displayName: 'Token Account',
  name: 'tokenAccount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenAccountBalance'],
    },
  },
  default: '',
  description: 'The token account address',
},
{
  displayName: 'Delegate',
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
  description: 'The delegate address',
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
  description: 'The program ID (optional)',
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  options: [
    { name: 'Processed', value: 'processed' },
    { name: 'Confirmed', value: 'confirmed' },
    { name: 'Finalized', value: 'finalized' },
  ],
  default: 'finalized',
  displayOptions: {
    show: {
      resource: ['token'],
      operation: ['getTokenSupply', 'getTokenAccountBalance', 'getTokenAccountsByDelegate', 'getTokenLargestAccounts'],
    },
  },
  description: 'The commitment level for data consistency',
},
{
  displayName: 'Metadata Address',
  name: 'metadataAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nft'],
      operation: ['getAccountInfo']
    }
  },
  default: '',
  placeholder: 'Enter NFT metadata account address (base58 encoded)',
  description: 'The public key of the NFT metadata account'
},
{
  displayName: 'Program ID',
  name: 'programId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nft'],
      operation: ['getProgramAccounts']
    }
  },
  default: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  description: 'The Metaplex Token Metadata Program ID'
},
{
  displayName: 'Metadata Addresses',
  name: 'metadataAddresses',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nft'],
      operation: ['getMultipleAccounts']
    }
  },
  default: '',
  placeholder: 'Enter comma-separated metadata addresses',
  description: 'Comma-separated list of NFT metadata account addresses (base58 encoded)'
},
{
  displayName: 'Commitment',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nft'],
      operation: ['getAccountInfo', 'getProgramAccounts', 'getMultipleAccounts']
    }
  },
  options: [
    { name: 'Processed', value: 'processed' },
    { name: 'Confirmed', value: 'confirmed' },
    { name: 'Finalized', value: 'finalized' }
  ],
  default: 'confirmed',
  description: 'The commitment level for querying data'
},
{
  displayName: 'Encoding',
  name: 'encoding',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nft'],
      operation: ['getAccountInfo', 'getProgramAccounts', 'getMultipleAccounts']
    }
  },
  options: [
    { name: 'Base58', value: 'base58' },
    { name: 'Base64', value: 'base64' },
    { name: 'JSON Parsed', value: 'jsonParsed' }
  ],
  default: 'base64',
  description: 'Encoding format for account data'
},
{
  displayName: 'Creator Address',
  name: 'creatorAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nft'],
      operation: ['getProgramAccounts']
    }
  },
  default: '',
  placeholder: 'Enter creator address to filter by',
  description: 'Filter NFTs by creator address (optional)'
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nft'],
      operation: ['getProgramAccounts']
    }
  },
  default: '',
  placeholder: 'Enter owner address to filter by',
  description: 'Filter NFTs by owner address (optional)'
},
{
	displayName: 'Program ID',
	name: 'programId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['program'],
			operation: ['getProgramAccounts', 'getAccountInfo'],
		},
	},
	default: '',
	placeholder: '11111111111111111111111111111112',
	description: 'The program public key as a base58 encoded string',
},
{
	displayName: 'Commitment',
	name: 'commitment',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['program'],
			operation: ['getProgramAccounts', 'getAccountInfo'],
		},
	},
	options: [
		{
			name: 'Finalized',
			value: 'finalized',
			description: 'Query the most recent block confirmed by supermajority of the cluster',
		},
		{
			name: 'Confirmed',
			value: 'confirmed',
			description: 'Query the most recent block that has been voted on by supermajority of the cluster',
		},
		{
			name: 'Processed',
			value: 'processed',
			description: 'Query the most recent block which has reached 1 confirmation',
		},
	],
	default: 'finalized',
	description: 'Commitment level for querying state',
},
{
	displayName: 'Encoding',
	name: 'encoding',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['program'],
			operation: ['getProgramAccounts', 'getAccountInfo'],
		},
	},
	options: [
		{
			name: 'Base58',
			value: 'base58',
			description: 'Base58 encoding',
		},
		{
			name: 'Base64',
			value: 'base64',
			description: 'Base64 encoding',
		},
		{
			name: 'Base64+Zstd',
			value: 'base64+zstd',
			description: 'Base64 encoding with Zstd compression',
		},
		{
			name: 'JSON Parsed',
			value: 'jsonParsed',
			description: 'JSON format with parsed account data',
		},
	],
	default: 'base64',
	description: 'Encoding format for account data',
},
{
	displayName: 'Filters',
	name: 'filters',
	type: 'fixedCollection',
	displayOptions: {
		show: {
			resource: ['program'],
			operation: ['getProgramAccounts'],
		},
	},
	default: {},
	placeholder: 'Add Filter',
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			name: 'filter',
			displayName: 'Filter',
			values: [
				{
					displayName: 'Filter Type',
					name: 'filterType',
					type: 'options',
					options: [
						{
							name: 'Data Size',
							value: 'dataSize',
							description: 'Filter by account data size',
						},
						{
							name: 'Memcmp',
							value: 'memcmp',
							description: 'Filter by memory comparison at specific offset',
						},
					],
					default: 'dataSize',
				},
				{
					displayName: 'Data Size',
					name: 'dataSize',
					type: 'number',
					displayOptions: {
						show: {
							filterType: ['dataSize'],
						},
					},
					default: 0,
					description: 'Size of account data in bytes',
				},
				{
					displayName: 'Offset',
					name: 'offset',
					type: 'number',
					displayOptions: {
						show: {
							filterType: ['memcmp'],
						},
					},
					default: 0,
					description: 'Byte offset for memory comparison',
				},
				{
					displayName: 'Bytes',
					name: 'bytes',
					type: 'string',
					displayOptions: {
						show: {
							filterType: ['memcmp'],
						},
					},
					default: '',
					description: 'Data to compare as base58 encoded string',
				},
			],
		},
	],
	description: 'Filters to apply when fetching program accounts',
},
{
	displayName: 'With Context',
	name: 'withContext',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['program'],
			operation: ['getProgramAccounts'],
		},
	},
	default: false,
	description: 'Whether to return the slot and context information',
},
{
	displayName: 'Data Slice',
	name: 'dataSlice',
	type: 'fixedCollection',
	displayOptions: {
		show: {
			resource: ['program'],
			operation: ['getProgramAccounts', 'getAccountInfo'],
		},
	},
	default: {},
	options: [
		{
			name: 'slice',
			displayName: 'Data Slice',
			values: [
				{
					displayName: 'Offset',
					name: 'offset',
					type: 'number',
					default: 0,
					description: 'Byte offset from which to start returning data',
				},
				{
					displayName: 'Length',
					name: 'length',
					type: 'number',
					default: 0,
					description: 'Number of bytes to return',
				},
			],
		},
	],
	description: 'Limit the returned account data using the provided offset and length fields',
},
{
  displayName: 'Stake Account Public Key',
  name: 'pubkey',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['validator'],
      operation: ['getStakeActivation'],
    },
  },
  default: '',
  description: 'Public key of the stake account to query',
},
{
  displayName: 'Commitment Level',
  name: 'commitment',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['validator'],
      operation: ['getVoteAccounts', 'getStakeActivation', 'getInflationReward', 'getInflationGovernor'],
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
  description: 'The level of commitment desired',
},
{
  displayName: 'Vote Public Key',
  name: 'votePubkey',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['validator'],
      operation: ['getVoteAccounts'],
    },
  },
  default: '',
  description: 'Only return results for this validator vote address (base58 encoded)',
},
{
  displayName: 'Keep Unstaked Delinquents',
  name: 'keepUnstakedDelinquents',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['validator'],
      operation: ['getVoteAccounts'],
    },
  },
  default: false,
  description: 'Do not filter out delinquent validators with no stake',
},
{
  displayName: 'Epoch',
  name: 'epoch',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['validator'],
      operation: ['getStakeActivation', 'getInflationReward'],
    },
  },
  default: '',
  description: 'Epoch for which to fetch the activation/reward. If omitted, the stake activation/reward for the current epoch is fetched',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['validator'],
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
      case 'block':
        return [await executeBlockOperations.call(this, items)];
      case 'token':
        return [await executeTokenOperations.call(this, items)];
      case 'nft':
        return [await executeNftOperations.call(this, items)];
      case 'program':
        return [await executeProgramOperations.call(this, items)];
      case 'validator':
        return [await executeValidatorOperations.call(this, items)];
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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
          const pubkeys = pubkeysString.split(',').map((key: string) => key.trim());
          const commitment = this.getNodeParameter('commitment', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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

        case 'getTokenAccountsByOwner': {
          const owner = this.getNodeParameter('owner', i) as string;
          const mint = this.getNodeParameter('mint', i) as string;
          const tokenProgramId = this.getNodeParameter('tokenProgramId', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;

          let filter: any;
          if (mint) {
            filter = { mint };
          } else {
            filter = { programId: tokenProgramId };
          }

          const requestBody: any = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccountsByOwner',
            params: [
              owner,
              filter,
              {
                commitment,
                encoding,
              },
            ],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
      const rpcUrl = credentials.rpcUrl || credentials.baseUrl || 'https://api.mainnet-beta.solana.com';

      switch (operation) {
        case 'sendTransaction': {
          const transaction = this.getNodeParameter('transaction', i) as string;
          const encoding = this.getNodeParameter('encoding', i) as string;
          const skipPreflight = this.getNodeParameter('skipPreflight', i) as boolean;
          const commitment = this.getNodeParameter('commitment', i) as string;

          const body = {
            jsonrpc: '2.0',
            id: 1,
            method: 'sendTransaction',
            params: [
              transaction,
              {
                encoding,
                skipPreflight,
                commitment
              }
            ]
          };

          const options: any = {
            method: 'POST',
            url: rpcUrl,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'simulateTransaction': {
          const transaction = this.getNodeParameter('transaction', i) as string;
          const commitment = this.getNodeParameter('commitment', i) as string;
          const sigVerify = this.getNodeParameter('sigVerify', i) as boolean;
          const encoding = this.getNodeParameter('encoding', i) as string;

          const body = {
            jsonrpc: '2.0',
            id: 1,
            method: 'simulateTransaction',
            params: [
              transaction,
              {
                commitment,
                sigVerify,
                encoding
              }
            ]
          };

          const options: any = {
            method: 'POST',
            url: rpcUrl,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
          };

          if (credentials.apiKey) {
            options.headers.Authorization = `Bearer ${credentials.apiKey}`;
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
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
            url: credentials.baseUrl || credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getClusterNodes': {
          const requestBody = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getClusterNodes',
            params: [],
          };

          const options: any = {
            method: 'POST',
            url: credentials.rpcUrl || 'https://api.mainnet-beta.solana.com',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
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