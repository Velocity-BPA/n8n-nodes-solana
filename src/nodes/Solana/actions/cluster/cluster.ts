/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import type { ContactInfo } from '@solana/web3.js';
import { createSolanaClient, lamportsToSol } from '../../transport';

export const clusterOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cluster'],
			},
		},
		options: [
			{
				name: 'Get Cluster Nodes',
				value: 'getClusterNodes',
				description: 'Get list of cluster nodes',
				action: 'Get cluster nodes',
			},
			{
				name: 'Get Health',
				value: 'getHealth',
				description: 'Check RPC node health',
				action: 'Get health',
			},
			{
				name: 'Get Version',
				value: 'getVersion',
				description: 'Get Solana version',
				action: 'Get version',
			},
			{
				name: 'Get Supply',
				value: 'getSupply',
				description: 'Get SOL supply statistics',
				action: 'Get supply',
			},
		],
		default: 'getVersion',
	},
];

export const clusterFields: INodeProperties[] = [];

export async function executeClusterOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const credentials = await this.getCredentials('solanaApi');
	const client = createSolanaClient(credentials);

	let result: any;

	switch (operation) {
		case 'getClusterNodes': {
			const nodes = await client.getClusterNodes();
			result = {
				nodes: nodes.map((node: ContactInfo) => ({
					pubkey: node.pubkey,
					gossip: node.gossip,
					tpu: node.tpu,
					rpc: node.rpc,
					version: node.version,
					featureSet: (node as any).featureSet,
					shredVersion: (node as any).shredVersion,
				})),
				count: nodes.length,
			};
			break;
		}
		case 'getHealth': {
			const health = await client.getHealth();
			result = {
				status: health,
				healthy: health === 'ok',
			};
			break;
		}
		case 'getVersion': {
			const version = await client.getVersion();
			result = {
				solanaCore: version['solana-core'],
				featureSet: version['feature-set'],
			};
			break;
		}
		case 'getSupply': {
			const supply = await client.getSupply();
			result = {
				total: supply.value.total,
				totalSol: lamportsToSol(supply.value.total),
				circulating: supply.value.circulating,
				circulatingSol: lamportsToSol(supply.value.circulating),
				nonCirculating: supply.value.nonCirculating,
				nonCirculatingSol: lamportsToSol(supply.value.nonCirculating),
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result }];
}
