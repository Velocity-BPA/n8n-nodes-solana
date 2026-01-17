/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	ITriggerResponse,
} from 'n8n-workflow';
import { createSolanaClient, toPublicKey } from './transport';

export class SolanaTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Solana Trigger',
		name: 'solanaTrigger',
		icon: 'file:solana.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Listen for Solana blockchain events',
		defaults: {
			name: 'Solana Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'solanaApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Account Change',
						value: 'accountChange',
						description: 'Trigger when an account balance or data changes',
					},
					{
						name: 'Program Account Change',
						value: 'programAccountChange',
						description: 'Trigger when any account owned by a program changes',
					},
					{
						name: 'Slot Change',
						value: 'slotChange',
						description: 'Trigger on every new slot',
					},
					{
						name: 'Root Change',
						value: 'rootChange',
						description: 'Trigger when a new root is set',
					},
					{
						name: 'Logs',
						value: 'logs',
						description: 'Trigger on program log messages',
					},
				],
				default: 'accountChange',
				description: 'The event to listen for',
			},
			{
				displayName: 'Account Address',
				name: 'accountAddress',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						event: ['accountChange'],
					},
				},
				default: '',
				description: 'The account address to monitor',
			},
			{
				displayName: 'Program ID',
				name: 'programId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						event: ['programAccountChange', 'logs'],
					},
				},
				default: '',
				description: 'The program ID to monitor',
			},
			{
				displayName: 'Commitment',
				name: 'commitment',
				type: 'options',
				options: [
					{
						name: 'Processed',
						value: 'processed',
					},
					{
						name: 'Confirmed',
						value: 'confirmed',
					},
					{
						name: 'Finalized',
						value: 'finalized',
					},
				],
				default: 'confirmed',
				description: 'The commitment level for subscriptions',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const event = this.getNodeParameter('event') as string;
		const credentials = await this.getCredentials('solanaApi');
		const client = createSolanaClient(credentials);
		const connection = client.getConnection();
		const commitment = this.getNodeParameter('commitment') as 'processed' | 'confirmed' | 'finalized';

		let subscriptionId: number;

		const emit = (data: any) => {
			this.emit([this.helpers.returnJsonArray([data])]);
		};

		switch (event) {
			case 'accountChange': {
				const accountAddress = this.getNodeParameter('accountAddress') as string;
				const pubkey = toPublicKey(accountAddress);
				
				subscriptionId = connection.onAccountChange(
					pubkey,
					(accountInfo) => {
						emit({
							event: 'accountChange',
							address: accountAddress,
							lamports: accountInfo.lamports,
							owner: accountInfo.owner.toBase58(),
							executable: accountInfo.executable,
							rentEpoch: accountInfo.rentEpoch,
							timestamp: new Date().toISOString(),
						});
					},
					commitment,
				);
				break;
			}
			case 'programAccountChange': {
				const programId = this.getNodeParameter('programId') as string;
				const pubkey = toPublicKey(programId);
				
				subscriptionId = connection.onProgramAccountChange(
					pubkey,
					(keyedAccountInfo) => {
						emit({
							event: 'programAccountChange',
							programId,
							accountId: keyedAccountInfo.accountId.toBase58(),
							lamports: keyedAccountInfo.accountInfo.lamports,
							owner: keyedAccountInfo.accountInfo.owner.toBase58(),
							timestamp: new Date().toISOString(),
						});
					},
					commitment,
				);
				break;
			}
			case 'slotChange': {
				subscriptionId = connection.onSlotChange((slotInfo) => {
					emit({
						event: 'slotChange',
						slot: slotInfo.slot,
						parent: slotInfo.parent,
						root: slotInfo.root,
						timestamp: new Date().toISOString(),
					});
				});
				break;
			}
			case 'rootChange': {
				subscriptionId = connection.onRootChange((root) => {
					emit({
						event: 'rootChange',
						root,
						timestamp: new Date().toISOString(),
					});
				});
				break;
			}
			case 'logs': {
				const programId = this.getNodeParameter('programId') as string;
				const pubkey = toPublicKey(programId);
				
				subscriptionId = connection.onLogs(
					pubkey,
					(logs) => {
						emit({
							event: 'logs',
							programId,
							signature: logs.signature,
							logs: logs.logs,
							err: logs.err,
							timestamp: new Date().toISOString(),
						});
					},
					commitment,
				);
				break;
			}
			default:
				throw new Error(`Unknown event: ${event}`);
		}

		const closeFunction = async () => {
			if (subscriptionId !== undefined) {
				switch (event) {
					case 'accountChange':
						await connection.removeAccountChangeListener(subscriptionId);
						break;
					case 'programAccountChange':
						await connection.removeProgramAccountChangeListener(subscriptionId);
						break;
					case 'slotChange':
						await connection.removeSlotChangeListener(subscriptionId);
						break;
					case 'rootChange':
						await connection.removeRootChangeListener(subscriptionId);
						break;
					case 'logs':
						await connection.removeOnLogsListener(subscriptionId);
						break;
				}
			}
		};

		return {
			closeFunction,
		};
	}
}
