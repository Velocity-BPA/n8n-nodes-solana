/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { createSolanaClient, lamportsToSol } from '../../transport';

export const programOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['program'],
			},
		},
		options: [
			{
				name: 'Get Program Accounts',
				value: 'getProgramAccounts',
				description: 'Get accounts owned by a program',
				action: 'Get program accounts',
			},
			{
				name: 'Get Account Data',
				value: 'getAccountData',
				description: 'Get parsed account data',
				action: 'Get account data',
			},
		],
		default: 'getProgramAccounts',
	},
];

export const programFields: INodeProperties[] = [
	{
		displayName: 'Program ID',
		name: 'programId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['program'],
				operation: ['getProgramAccounts'],
			},
		},
		default: '',
		placeholder: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
		description: 'The program ID to query',
	},
	{
		displayName: 'Account Address',
		name: 'accountAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['program'],
				operation: ['getAccountData'],
			},
		},
		default: '',
		description: 'The account address to query',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['program'],
				operation: ['getProgramAccounts'],
			},
		},
		default: 100,
		description: 'Maximum number of accounts to return',
	},
];

export async function executeProgramOperation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const credentials = await this.getCredentials('solanaApi');
	const client = createSolanaClient(credentials);

	let result: any;

	switch (operation) {
		case 'getProgramAccounts': {
			const programId = this.getNodeParameter('programId', index) as string;
			const limit = this.getNodeParameter('limit', index) as number;
			const accounts = await client.getProgramAccounts(programId);
			const limitedAccounts = accounts.slice(0, limit);
			result = {
				programId,
				accounts: limitedAccounts.map((acc) => ({
					address: acc.pubkey.toBase58(),
					lamports: acc.account.lamports,
					balance: lamportsToSol(acc.account.lamports),
					data: acc.account.data,
				})),
				count: limitedAccounts.length,
				totalFound: accounts.length,
			};
			break;
		}
		case 'getAccountData': {
			const accountAddress = this.getNodeParameter('accountAddress', index) as string;
			const accountInfo = await client.getParsedAccountInfo(accountAddress);
			if (!accountInfo) {
				result = { found: false, address: accountAddress };
			} else {
				result = {
					found: true,
					address: accountAddress,
					lamports: accountInfo.lamports,
					balance: lamportsToSol(accountInfo.lamports),
					owner: accountInfo.owner.toBase58(),
					executable: accountInfo.executable,
					data: accountInfo.data,
				};
			}
			break;
		}
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	return [{ json: result }];
}
