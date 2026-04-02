import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SolanaApi implements ICredentialType {
	name = 'solanaApi';
	displayName = 'Solana API';
	documentationUrl = 'https://docs.solana.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'RPC Provider',
			name: 'provider',
			type: 'options',
			options: [
				{
					name: 'Solana Mainnet (Public)',
					value: 'public',
				},
				{
					name: 'QuickNode',
					value: 'quicknode',
				},
				{
					name: 'Alchemy',
					value: 'alchemy',
				},
				{
					name: 'Helius',
					value: 'helius',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'public',
		},
		{
			displayName: 'RPC URL',
			name: 'rpcUrl',
			type: 'string',
			default: 'https://api.mainnet-beta.solana.com',
			required: true,
			description: 'The Solana RPC endpoint URL',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			displayOptions: {
				show: {
					provider: ['quicknode', 'alchemy', 'helius'],
				},
			},
			description: 'API key for the RPC provider',
		},
	];
}