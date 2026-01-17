/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import type { VoteAccountInfo } from '@solana/web3.js';
import { createSolanaClient, lamportsToSol } from '../../transport';

export const stakeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['stake'],
			},
		},
		options: [
			{
				name: 'Get Stake Accounts',
				value: 'getStakeAccounts',
				description: 'Get stake accounts for an address',
				action: 'Get stake accounts',
			},
			{
				name: 'Get Stake Activation',
				value: 'getStakeActivation',
				description: 'Get stake activation status',
				action: 'Get stake activation',
			},
			{
				name: 'Get Validators',
				value: 'getValidators',
				description: 'Get list of validators',
				action: 'Get validators',
			},
			{
				name: 'Get Epoch Info',
				value: 'getEpochInfo',
				description: 'Get current epoch information',
				action: 'Get epoch info',
			},
		],
		default: 'getStakeAccounts',
	},
];

export const stakeFields: INodeProperties[] = [
	{
		displayName: 'Wallet Address',
		name: 'walletAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['stake'],
				operation: ['getStakeAccounts'],
			},
		},
		default: '',
		description: 'The wallet address to query stake accounts for',
	},
	{
		displayName: 'Stake Address',
		name: 'stakeAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['stake'],
				operation: ['getStakeActivation'],
			},
		},
		default: '',
		description: 'The stake account address',
	},
];

export async function executeStakeOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const credentials = await this.getCredentials('solanaApi');
	const client = createSolanaClient(credentials);

	let result: any;

	switch (operation) {
		case 'getStakeAccounts': {
			const walletAddress = this.getNodeParameter('walletAddress', index) as string;
			const stakeAccounts = await client.getStakeAccounts(walletAddress);
			result = {
				walletAddress,
				stakeAccounts: stakeAccounts.map((acc) => ({
					address: acc.pubkey.toBase58(),
					lamports: acc.account.lamports,
					balance: lamportsToSol(acc.account.lamports),
					data: acc.account.data,
				})),
				count: stakeAccounts.length,
			};
			break;
		}
		case 'getStakeActivation': {
			const stakeAddress = this.getNodeParameter('stakeAddress', index) as string;
			const activation = await client.getStakeActivation(stakeAddress);
			result = {
				stakeAddress,
				state: activation.state,
				active: activation.active,
				inactive: activation.inactive,
			};
			break;
		}
		case 'getValidators': {
			const validators = await client.getValidators();
			result = {
				current: validators.current.map((v: VoteAccountInfo) => ({
					votePubkey: v.votePubkey,
					nodePubkey: v.nodePubkey,
					activatedStake: v.activatedStake,
					commission: v.commission,
					lastVote: v.lastVote,
					epochCredits: v.epochCredits,
				})),
				delinquent: validators.delinquent.map((v: VoteAccountInfo) => ({
					votePubkey: v.votePubkey,
					nodePubkey: v.nodePubkey,
					activatedStake: v.activatedStake,
					commission: v.commission,
					lastVote: v.lastVote,
				})),
				currentCount: validators.current.length,
				delinquentCount: validators.delinquent.length,
			};
			break;
		}
		case 'getEpochInfo': {
			const epochInfo = await client.getEpochInfo();
			const slotsRemaining = epochInfo.slotsInEpoch - epochInfo.slotIndex;
			const estimatedTimeRemainingHours = (slotsRemaining * 0.4) / 3600;
			result = {
				epoch: epochInfo.epoch,
				absoluteSlot: epochInfo.absoluteSlot,
				blockHeight: epochInfo.blockHeight,
				slotIndex: epochInfo.slotIndex,
				slotsInEpoch: epochInfo.slotsInEpoch,
				epochProgress: ((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100).toFixed(2) + '%',
				slotsRemaining,
				estimatedTimeRemainingHours: estimatedTimeRemainingHours.toFixed(2),
			};
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result }];
}
