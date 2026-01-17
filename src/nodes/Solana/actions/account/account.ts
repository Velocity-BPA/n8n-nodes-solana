/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { createSolanaClient, lamportsToSol } from '../../transport';

export const accountOperations: INodeProperties[] = [
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
				name: 'Get Balance',
				value: 'getBalance',
				description: 'Get SOL balance of an account',
				action: 'Get balance',
			},
			{
				name: 'Get Account Info',
				value: 'getAccountInfo',
				description: 'Get full account information',
				action: 'Get account info',
			},
			{
				name: 'Get Token Accounts',
				value: 'getTokenAccounts',
				description: 'Get all token accounts for an address',
				action: 'Get token accounts',
			},
			{
				name: 'Get Transaction History',
				value: 'getTransactionHistory',
				description: 'Get recent transactions for an address',
				action: 'Get transaction history',
			},
			{
				name: 'Request Airdrop',
				value: 'requestAirdrop',
				description: 'Request SOL airdrop (devnet/testnet only)',
				action: 'Request airdrop',
			},
		],
		default: 'getBalance',
	},
];

export const accountFields: INodeProperties[] = [
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getBalance', 'getAccountInfo', 'getTokenAccounts', 'getTransactionHistory', 'requestAirdrop'],
			},
		},
		default: '',
		placeholder: 'So11111111111111111111111111111111111111112',
		description: 'The Solana address to query',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getTransactionHistory'],
			},
		},
		default: 10,
		description: 'Maximum number of transactions to return',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['requestAirdrop'],
			},
		},
		default: 1,
		description: 'Amount of SOL to request (max 2 SOL per request)',
	},
];

export async function executeAccountOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const credentials = await this.getCredentials('solanaApi');
	const client = createSolanaClient(credentials);

	let result: any;

	switch (operation) {
		case 'getBalance': {
			const address = this.getNodeParameter('address', index) as string;
			const balance = await client.getBalance(address);
			result = {
				address,
				balance: balance.sol,
				balanceLamports: balance.lamports,
			};
			break;
		}
		case 'getAccountInfo': {
			const address = this.getNodeParameter('address', index) as string;
			const accountInfo = await client.getParsedAccountInfo(address);
			result = {
				address,
				exists: accountInfo !== null,
				...(accountInfo && {
					lamports: accountInfo.lamports,
					balance: lamportsToSol(accountInfo.lamports),
					owner: accountInfo.owner.toBase58(),
					executable: accountInfo.executable,
					rentEpoch: accountInfo.rentEpoch,
					data: accountInfo.data,
				}),
			};
			break;
		}
		case 'getTokenAccounts': {
			const address = this.getNodeParameter('address', index) as string;
			const tokenAccounts = await client.getTokenAccounts(address);
			result = {
				address,
				tokenAccounts,
				count: tokenAccounts.length,
			};
			break;
		}
		case 'getTransactionHistory': {
			const address = this.getNodeParameter('address', index) as string;
			const limit = this.getNodeParameter('limit', index) as number;
			const transactions = await client.getTransactionHistory(address, limit);
			result = {
				address,
				transactions: transactions.map((tx) => ({
					signature: tx.transaction.signatures[0],
					slot: tx.slot,
					blockTime: tx.blockTime,
					fee: tx.meta?.fee,
					status: tx.meta?.err ? 'failed' : 'success',
				})),
				count: transactions.length,
			};
			break;
		}
		case 'requestAirdrop': {
			const address = this.getNodeParameter('address', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const signature = await client.requestAirdrop(address, amount);
			result = {
				success: true,
				address,
				amount,
				signature,
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result }];
}
