/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	accountOperations,
	accountFields,
	executeAccountOperation,
	transactionOperations,
	transactionFields,
	executeTransactionOperation,
	splTokenOperations,
	splTokenFields,
	executeSplTokenOperation,
	nftOperations,
	nftFields,
	executeNftOperation,
	stakeOperations,
	stakeFields,
	executeStakeOperation,
	programOperations,
	programFields,
	executeProgramOperation,
	blockOperations,
	blockFields,
	executeBlockOperation,
	clusterOperations,
	clusterFields,
	executeClusterOperation,
} from './actions';

export class Solana implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Solana',
		name: 'solana',
		icon: 'file:solana.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Solana blockchain',
		defaults: {
			name: 'Solana',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'solanaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Account operations',
					},
					{
						name: 'Transaction',
						value: 'transaction',
						description: 'Transaction operations',
					},
					{
						name: 'SPL Token',
						value: 'splToken',
						description: 'SPL token operations',
					},
					{
						name: 'NFT',
						value: 'nft',
						description: 'NFT operations (Metaplex)',
					},
					{
						name: 'Stake',
						value: 'stake',
						description: 'Staking operations',
					},
					{
						name: 'Program',
						value: 'program',
						description: 'Program account operations',
					},
					{
						name: 'Block',
						value: 'block',
						description: 'Block operations',
					},
					{
						name: 'Cluster',
						value: 'cluster',
						description: 'Cluster operations',
					},
				],
				default: 'account',
			},
			...accountOperations,
			...accountFields,
			...transactionOperations,
			...transactionFields,
			...splTokenOperations,
			...splTokenFields,
			...nftOperations,
			...nftFields,
			...stakeOperations,
			...stakeFields,
			...programOperations,
			...programFields,
			...blockOperations,
			...blockFields,
			...clusterOperations,
			...clusterFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				let result: INodeExecutionData[];

				switch (resource) {
					case 'account':
						result = await executeAccountOperation.call(this, i);
						break;
					case 'transaction':
						result = await executeTransactionOperation.call(this, i);
						break;
					case 'splToken':
						result = await executeSplTokenOperation.call(this, i);
						break;
					case 'nft':
						result = await executeNftOperation.call(this, i);
						break;
					case 'stake':
						result = await executeStakeOperation.call(this, i);
						break;
					case 'program':
						result = await executeProgramOperation.call(this, i);
						break;
					case 'block':
						result = await executeBlockOperation.call(this, i);
						break;
					case 'cluster':
						result = await executeClusterOperation.call(this, i);
						break;
					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
