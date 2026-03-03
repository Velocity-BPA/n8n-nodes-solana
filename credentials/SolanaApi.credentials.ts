import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SolanaApi implements ICredentialType {
	name = 'solanaApi';
	displayName = 'Solana API';
	documentationUrl = 'https://docs.solana.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'RPC Endpoint URL',
			name: 'rpcUrl',
			type: 'string',
			default: 'https://api.mainnet-beta.solana.com',
			required: true,
			description: 'The Solana RPC endpoint URL',
		},
		{
			displayName: 'Authentication Type',
			name: 'authType',
			type: 'options',
			options: [
				{
					name: 'None (Public Endpoint)',
					value: 'none',
				},
				{
					name: 'API Key (Header)',
					value: 'apiKey',
				},
				{
					name: 'Bearer Token',
					value: 'bearerToken',
				},
			],
			default: 'none',
			required: true,
			description: 'The authentication method to use',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			displayOptions: {
				show: {
					authType: ['apiKey'],
				},
			},
			description: 'API key for authenticated requests',
		},
		{
			displayName: 'Header Name',
			name: 'headerName',
			type: 'string',
			default: 'X-API-Key',
			required: false,
			displayOptions: {
				show: {
					authType: ['apiKey'],
				},
			},
			description: 'Header name for the API key (e.g., X-API-Key, Authorization)',
		},
		{
			displayName: 'Bearer Token',
			name: 'bearerToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			displayOptions: {
				show: {
					authType: ['bearerToken'],
				},
			},
			description: 'Bearer token for authenticated requests',
		},
	];
}