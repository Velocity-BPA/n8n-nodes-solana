/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SolanaApi implements ICredentialType {
	name = 'solanaApi';
	displayName = 'Solana API';
	documentationUrl = 'https://docs.solana.com/developing/clients/jsonrpc-api';
	
	properties: INodeProperties[] = [
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'Mainnet-Beta',
					value: 'mainnet-beta',
					description: 'Solana mainnet production network',
				},
				{
					name: 'Testnet',
					value: 'testnet',
					description: 'Solana testnet for testing',
				},
				{
					name: 'Devnet',
					value: 'devnet',
					description: 'Solana devnet for development',
				},
				{
					name: 'Custom',
					value: 'custom',
					description: 'Use a custom RPC endpoint',
				},
			],
			default: 'devnet',
			description: 'The Solana network to connect to',
		},
		{
			displayName: 'Custom RPC URL',
			name: 'customRpcUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-rpc-endpoint.com',
			description: 'Custom RPC endpoint URL (only used when Network is set to Custom)',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'Base58 encoded private key',
			description: 'Base58 encoded private key for signing transactions (optional - only needed for write operations)',
		},
		{
			displayName: 'Commitment Level',
			name: 'commitment',
			type: 'options',
			options: [
				{
					name: 'Processed',
					value: 'processed',
					description: 'Query the most recent block that has reached 1 confirmation',
				},
				{
					name: 'Confirmed',
					value: 'confirmed',
					description: 'Query the most recent block that has reached 2/3 supermajority commitment',
				},
				{
					name: 'Finalized',
					value: 'finalized',
					description: 'Query the most recent block that has been finalized by the cluster',
				},
			],
			default: 'confirmed',
			description: 'The level of commitment for queries and transactions',
		},
		{
			displayName: 'WebSocket URL',
			name: 'wsUrl',
			type: 'string',
			default: '',
			placeholder: 'wss://your-websocket-endpoint.com',
			description: 'WebSocket endpoint URL for subscriptions (optional - auto-derived from RPC URL if not specified)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.network === "custom" ? $credentials.customRpcUrl : ($credentials.network === "mainnet-beta" ? "https://api.mainnet-beta.solana.com" : ($credentials.network === "testnet" ? "https://api.testnet.solana.com" : "https://api.devnet.solana.com"))}}',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method: 'getVersion',
			}),
		},
	};
}
