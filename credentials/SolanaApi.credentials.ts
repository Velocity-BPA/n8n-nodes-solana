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
			displayName: 'RPC URL',
			name: 'rpcUrl',
			type: 'string',
			default: 'https://api.mainnet-beta.solana.com',
			required: true,
			description: 'The Solana RPC endpoint URL. Use public endpoints or your RPC provider URL.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for authenticated RPC providers (optional for public endpoints)',
		},
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'Mainnet Beta',
					value: 'mainnet-beta',
				},
				{
					name: 'Testnet',
					value: 'testnet',
				},
				{
					name: 'Devnet',
					value: 'devnet',
				},
			],
			default: 'mainnet-beta',
			description: 'The Solana network to connect to',
		},
	];
}