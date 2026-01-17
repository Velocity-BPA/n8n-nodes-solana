/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { createSolanaClient } from '../../transport';

export const transactionOperations: INodeProperties[] = [
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
				name: 'Send SOL',
				value: 'sendSol',
				description: 'Send SOL to another address',
				action: 'Send SOL',
			},
			{
				name: 'Get Transaction',
				value: 'getTransaction',
				description: 'Get transaction details by signature',
				action: 'Get transaction',
			},
			{
				name: 'Get Transaction Status',
				value: 'getTransactionStatus',
				description: 'Get transaction confirmation status',
				action: 'Get transaction status',
			},
			{
				name: 'Get Recent Blockhash',
				value: 'getRecentBlockhash',
				description: 'Get recent blockhash for signing transactions',
				action: 'Get recent blockhash',
			},
		],
		default: 'sendSol',
	},
];

export const transactionFields: INodeProperties[] = [
	{
		displayName: 'To Address',
		name: 'toAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['sendSol'],
			},
		},
		default: '',
		description: 'The recipient Solana address',
	},
	{
		displayName: 'Amount (SOL)',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['sendSol'],
			},
		},
		default: 0.01,
		description: 'Amount of SOL to send',
	},
	{
		displayName: 'Signature',
		name: 'signature',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['transaction'],
				operation: ['getTransaction', 'getTransactionStatus'],
			},
		},
		default: '',
		description: 'The transaction signature',
	},
];

export async function executeTransactionOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const credentials = await this.getCredentials('solanaApi');
	const client = createSolanaClient(credentials);
	const network = credentials.network as string;

	let result: any;

	switch (operation) {
		case 'sendSol': {
			const toAddress = this.getNodeParameter('toAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const signature = await client.sendSol(toAddress, amount);
			const explorerBase = network === 'mainnet-beta' 
				? 'https://explorer.solana.com' 
				: `https://explorer.solana.com?cluster=${network}`;
			result = {
				success: true,
				signature,
				toAddress,
				amount,
				explorerUrl: `${explorerBase}/tx/${signature}`,
			};
			break;
		}
		case 'getTransaction': {
			const signature = this.getNodeParameter('signature', index) as string;
			const tx = await client.getTransaction(signature);
			if (!tx) {
				result = { found: false, signature };
			} else {
				result = {
					found: true,
					signature,
					slot: tx.slot,
					blockTime: tx.blockTime,
					fee: tx.meta?.fee,
					status: tx.meta?.err ? 'failed' : 'success',
					error: tx.meta?.err,
				};
			}
			break;
		}
		case 'getTransactionStatus': {
			const signature = this.getNodeParameter('signature', index) as string;
			const status = await client.getTransactionStatus(signature);
			result = {
				signature,
				...status,
				confirmed: status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized',
			};
			break;
		}
		case 'getRecentBlockhash': {
			const blockhashInfo = await client.getRecentBlockhash();
			result = blockhashInfo;
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result }];
}
