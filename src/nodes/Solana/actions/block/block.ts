/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { createSolanaClient } from '../../transport';

export const blockOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['block'],
			},
		},
		options: [
			{
				name: 'Get Block',
				value: 'getBlock',
				description: 'Get block by slot',
				action: 'Get block',
			},
			{
				name: 'Get Block Height',
				value: 'getBlockHeight',
				description: 'Get current block height',
				action: 'Get block height',
			},
			{
				name: 'Get Slot',
				value: 'getSlot',
				description: 'Get current slot',
				action: 'Get slot',
			},
			{
				name: 'Get Block Time',
				value: 'getBlockTime',
				description: 'Get block timestamp',
				action: 'Get block time',
			},
		],
		default: 'getBlockHeight',
	},
];

export const blockFields: INodeProperties[] = [
	{
		displayName: 'Slot',
		name: 'slot',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['block'],
				operation: ['getBlock', 'getBlockTime'],
			},
		},
		default: 0,
		description: 'The slot number to query',
	},
];

export async function executeBlockOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const credentials = await this.getCredentials('solanaApi');
	const client = createSolanaClient(credentials);

	let result: any;

	switch (operation) {
		case 'getBlock': {
			const slot = this.getNodeParameter('slot', index) as number;
			const block = await client.getBlock(slot);
			if (!block) {
				result = { found: false, slot };
			} else {
				result = {
					found: true,
					slot,
					blockhash: block.blockhash,
					previousBlockhash: block.previousBlockhash,
					parentSlot: block.parentSlot,
					blockTime: block.blockTime,
					blockHeight: (block as any).blockHeight,
					transactionCount: block.transactions.length,
				};
			}
			break;
		}
		case 'getBlockHeight': {
			const blockHeight = await client.getBlockHeight();
			result = { blockHeight };
			break;
		}
		case 'getSlot': {
			const slot = await client.getSlot();
			result = { slot };
			break;
		}
		case 'getBlockTime': {
			const slot = this.getNodeParameter('slot', index) as number;
			const blockTime = await client.getBlockTime(slot);
			result = {
				slot,
				blockTime,
				blockTimeDate: blockTime ? new Date(blockTime * 1000).toISOString() : null,
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result }];
}
