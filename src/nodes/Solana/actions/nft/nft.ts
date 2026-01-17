/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import type { Metadata, Nft, Sft } from '@metaplex-foundation/js';
import { createSolanaClient } from '../../transport';

interface Creator {
	address: { toBase58(): string };
	verified: boolean;
	share: number;
}

export const nftOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['nft'],
			},
		},
		options: [
			{
				name: 'Get NFT Metadata',
				value: 'getNftMetadata',
				description: 'Get metadata for an NFT',
				action: 'Get NFT metadata',
			},
			{
				name: 'Get NFTs by Owner',
				value: 'getNftsByOwner',
				description: 'Get all NFTs owned by an address',
				action: 'Get NFTs by owner',
			},
		],
		default: 'getNftMetadata',
	},
];

export const nftFields: INodeProperties[] = [
	{
		displayName: 'Mint Address',
		name: 'mintAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['nft'],
				operation: ['getNftMetadata'],
			},
		},
		default: '',
		description: 'The NFT mint address',
	},
	{
		displayName: 'Owner Address',
		name: 'ownerAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['nft'],
				operation: ['getNftsByOwner'],
			},
		},
		default: '',
		description: 'The owner wallet address',
	},
];

export async function executeNftOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const credentials = await this.getCredentials('solanaApi');
	const client = createSolanaClient(credentials);

	let result: any;

	switch (operation) {
		case 'getNftMetadata': {
			const mintAddress = this.getNodeParameter('mintAddress', index) as string;
			const nft = await client.getNftMetadata(mintAddress) as Nft | Sft;
			result = {
				mintAddress,
				name: nft.name,
				symbol: nft.symbol,
				uri: nft.uri,
				sellerFeeBasisPoints: nft.sellerFeeBasisPoints,
				creators: nft.creators?.map((c: Creator) => ({
					address: c.address.toBase58(),
					verified: c.verified,
					share: c.share,
				})),
				collection: nft.collection ? {
					address: nft.collection.address.toBase58(),
					verified: nft.collection.verified,
				} : null,
				json: nft.json,
			};
			break;
		}
		case 'getNftsByOwner': {
			const ownerAddress = this.getNodeParameter('ownerAddress', index) as string;
			const nfts = await client.getNftsByOwner(ownerAddress);
			result = {
				ownerAddress,
				nfts: nfts.map((nft: Metadata | Nft | Sft) => ({
					mintAddress: (nft as any).mintAddress?.toBase58() || (nft as any).address?.toBase58() || 'unknown',
					name: nft.name,
					symbol: nft.symbol,
					uri: nft.uri,
				})),
				count: nfts.length,
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result }];
}
