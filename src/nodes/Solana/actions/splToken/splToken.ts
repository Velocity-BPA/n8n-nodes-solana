/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { TokenAccountBalancePair } from '@solana/web3.js';
import { createSolanaClient } from '../../transport';

export const splTokenOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['splToken'],
			},
		},
		options: [
			{
				name: 'Get Token Balance',
				value: 'getTokenBalance',
				description: 'Get SPL token balance for an address',
				action: 'Get token balance',
			},
			{
				name: 'Transfer Token',
				value: 'transferToken',
				description: 'Transfer SPL tokens to another address',
				action: 'Transfer token',
			},
			{
				name: 'Get Token Supply',
				value: 'getTokenSupply',
				description: 'Get total supply of an SPL token',
				action: 'Get token supply',
			},
			{
				name: 'Create Token Account',
				value: 'createTokenAccount',
				description: 'Create associated token account',
				action: 'Create token account',
			},
			{
				name: 'Get Largest Accounts',
				value: 'getLargestAccounts',
				description: 'Get largest token holders',
				action: 'Get largest accounts',
			},
		],
		default: 'getTokenBalance',
	},
];

export const splTokenFields: INodeProperties[] = [
	{
		displayName: 'Wallet Address',
		name: 'walletAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['splToken'],
				operation: ['getTokenBalance'],
			},
		},
		default: '',
		description: 'The wallet address to query',
	},
	{
		displayName: 'Mint Address',
		name: 'mintAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['splToken'],
				operation: ['getTokenBalance', 'transferToken', 'getTokenSupply', 'createTokenAccount', 'getLargestAccounts'],
			},
		},
		default: '',
		placeholder: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
		description: 'The token mint address',
	},
	{
		displayName: 'To Address',
		name: 'toAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['splToken'],
				operation: ['transferToken'],
			},
		},
		default: '',
		description: 'The recipient address',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['splToken'],
				operation: ['transferToken'],
			},
		},
		default: 1,
		description: 'Amount of tokens to transfer (in token units, not base units)',
	},
	{
		displayName: 'Owner Address',
		name: 'ownerAddress',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['splToken'],
				operation: ['createTokenAccount'],
			},
		},
		default: '',
		description: 'The owner of the new token account (defaults to your wallet)',
	},
];

export async function executeSplTokenOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const credentials = await this.getCredentials('solanaApi');
	const client = createSolanaClient(credentials);

	let result: any;

	switch (operation) {
		case 'getTokenBalance': {
			const walletAddress = this.getNodeParameter('walletAddress', index) as string;
			const mintAddress = this.getNodeParameter('mintAddress', index) as string;
			const balance = await client.getTokenBalance(walletAddress, mintAddress);
			result = {
				walletAddress,
				mintAddress,
				...balance,
			};
			break;
		}
		case 'transferToken': {
			const mintAddress = this.getNodeParameter('mintAddress', index) as string;
			const toAddress = this.getNodeParameter('toAddress', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const signature = await client.transferToken(mintAddress, toAddress, amount);
			result = {
				success: true,
				signature,
				mintAddress,
				toAddress,
				amount,
			};
			break;
		}
		case 'getTokenSupply': {
			const mintAddress = this.getNodeParameter('mintAddress', index) as string;
			const supply = await client.getTokenSupply(mintAddress);
			result = {
				mintAddress,
				amount: supply.amount,
				decimals: supply.decimals,
				uiAmount: supply.uiAmount,
			};
			break;
		}
		case 'createTokenAccount': {
			const mintAddress = this.getNodeParameter('mintAddress', index) as string;
			const ownerAddress = this.getNodeParameter('ownerAddress', index) as string;
			const signature = await client.createTokenAccount(mintAddress, ownerAddress || undefined);
			result = {
				success: true,
				signature,
				mintAddress,
				ownerAddress: ownerAddress || 'self',
			};
			break;
		}
		case 'getLargestAccounts': {
			const mintAddress = this.getNodeParameter('mintAddress', index) as string;
			const accounts = await client.getLargestTokenAccounts(mintAddress);
			result = {
				mintAddress,
				accounts: accounts.map((acc: TokenAccountBalancePair) => ({
					address: acc.address.toBase58(),
					amount: acc.amount,
					decimals: acc.decimals,
					uiAmount: acc.uiAmount,
				})),
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result }];
}
