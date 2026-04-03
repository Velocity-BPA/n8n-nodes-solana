import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SolanaApi implements ICredentialType {
	name = 'solanaApi';
	displayName = 'Solana API';
	properties: INodeProperties[] = [
		{
			displayName: 'RPC Endpoint URL',
			name: 'rpcUrl',
			type: 'string',
			default: 'https://api.mainnet-beta.solana.com',
			description: 'Solana RPC endpoint URL. Use custom endpoints from providers like QuickNode, Alchemy, or Helius for better performance.',
			required: true,
		},
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'None (Public Endpoint)',
					value: 'none',
				},
				{
					name: 'API Key in Header',
					value: 'header',
				},
				{
					name: 'API Key in URL',
					value: 'url',
				},
			],
			default: 'none',
			description: 'How to authenticate with the RPC provider',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for authentication (if required by your RPC provider)',
			displayOptions: {
				show: {
					authMethod: ['header', 'url'],
				},
			},
		},
		{
			displayName: 'Header Name',
			name: 'headerName',
			type: 'string',
			default: 'X-API-Key',
			description: 'Name of the header to send the API key in',
			displayOptions: {
				show: {
					authMethod: ['header'],
				},
			},
		},
	];
}