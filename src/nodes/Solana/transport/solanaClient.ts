/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	Connection,
	PublicKey,
	Keypair,
	clusterApiUrl,
	Commitment,
	LAMPORTS_PER_SOL,
	Transaction,
	SystemProgram,
	sendAndConfirmTransaction,
	ParsedTransactionWithMeta,
	ParsedAccountData,
	AccountInfo,
	GetProgramAccountsFilter,
	ContactInfo,
} from '@solana/web3.js';
import {
	getAssociatedTokenAddress,
	createAssociatedTokenAccountInstruction,
	createTransferInstruction,
	TOKEN_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
	getAccount,
	getMint,
} from '@solana/spl-token';
import { Metaplex } from '@metaplex-foundation/js';
import * as bs58 from 'bs58';
import type { ICredentialDataDecryptedObject } from 'n8n-workflow';

// Emit licensing notice once on module load
console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);

const NETWORK_ENDPOINTS: Record<string, string> = {
	'mainnet-beta': 'https://api.mainnet-beta.solana.com',
	testnet: 'https://api.testnet.solana.com',
	devnet: 'https://api.devnet.solana.com',
};

const WS_ENDPOINTS: Record<string, string> = {
	'mainnet-beta': 'wss://api.mainnet-beta.solana.com',
	testnet: 'wss://api.testnet.solana.com',
	devnet: 'wss://api.devnet.solana.com',
};

export interface ISolanaCredentials {
	network: string;
	customRpcUrl?: string;
	privateKey?: string;
	commitment: Commitment;
	wsUrl?: string;
}

export function lamportsToSol(lamports: number | bigint): number {
	return Number(lamports) / LAMPORTS_PER_SOL;
}

export function solToLamports(sol: number): number {
	return Math.floor(sol * LAMPORTS_PER_SOL);
}

export function toPublicKey(address: string): PublicKey {
	try {
		return new PublicKey(address);
	} catch {
		throw new Error(`Invalid Solana address: ${address}`);
	}
}

export function getRpcEndpoint(credentials: ISolanaCredentials): string {
	if (credentials.network === 'custom') {
		if (!credentials.customRpcUrl) {
			throw new Error('Custom RPC URL is required when using custom network');
		}
		return credentials.customRpcUrl;
	}
	return NETWORK_ENDPOINTS[credentials.network] || clusterApiUrl(credentials.network as any);
}

export function getWsEndpoint(credentials: ISolanaCredentials): string {
	if (credentials.wsUrl) {
		return credentials.wsUrl;
	}
	if (credentials.network === 'custom') {
		const rpcUrl = credentials.customRpcUrl || '';
		return rpcUrl.replace('https://', 'wss://').replace('http://', 'ws://');
	}
	return WS_ENDPOINTS[credentials.network] || '';
}

export function createConnection(credentials: ISolanaCredentials): Connection {
	const endpoint = getRpcEndpoint(credentials);
	const wsEndpoint = getWsEndpoint(credentials);
	
	return new Connection(endpoint, {
		commitment: credentials.commitment || 'confirmed',
		wsEndpoint: wsEndpoint || undefined,
	});
}

export function createKeypair(privateKey: string): Keypair {
	try {
		const secretKey = bs58.decode(privateKey);
		return Keypair.fromSecretKey(secretKey);
	} catch {
		try {
			const secretKey = Uint8Array.from(JSON.parse(privateKey));
			return Keypair.fromSecretKey(secretKey);
		} catch {
			throw new Error('Invalid private key format. Expected base58 encoded string or JSON array of bytes.');
		}
	}
}

export function getKeypairFromCredentials(credentials: ISolanaCredentials): Keypair {
	if (!credentials.privateKey) {
		throw new Error('Private key is required for this operation');
	}
	return createKeypair(credentials.privateKey);
}

export function createMetaplex(connection: Connection, keypair?: Keypair): Metaplex {
	const metaplex = new Metaplex(connection);
	if (keypair) {
		metaplex.identity().setDriver({
			publicKey: keypair.publicKey,
			signMessage: async (_message: Uint8Array) => {
				return keypair.secretKey.slice(0, 64);
			},
			signTransaction: async (transaction: Transaction) => {
				transaction.sign(keypair);
				return transaction;
			},
			signAllTransactions: async (transactions: Transaction[]) => {
				return transactions.map((tx) => {
					tx.sign(keypair);
					return tx;
				});
			},
		});
	}
	return metaplex;
}

export class SolanaClient {
	private connection: Connection;
	private keypair?: Keypair;
	private credentials: ISolanaCredentials;
	private metaplex?: Metaplex;

	constructor(credentials: ISolanaCredentials) {
		this.credentials = credentials;
		this.connection = createConnection(credentials);
		
		if (credentials.privateKey) {
			this.keypair = getKeypairFromCredentials(credentials);
		}
	}

	getConnection(): Connection {
		return this.connection;
	}

	getKeypair(): Keypair {
		if (!this.keypair) {
			throw new Error('Private key is required for this operation');
		}
		return this.keypair;
	}

	getPublicKey(): PublicKey {
		return this.getKeypair().publicKey;
	}

	getMetaplex(): Metaplex {
		if (!this.metaplex) {
			this.metaplex = createMetaplex(this.connection, this.keypair);
		}
		return this.metaplex;
	}

	async getBalance(address: string): Promise<{ lamports: number; sol: number }> {
		const pubkey = toPublicKey(address);
		const lamports = await this.connection.getBalance(pubkey);
		return {
			lamports,
			sol: lamportsToSol(lamports),
		};
	}

	async getAccountInfo(address: string): Promise<AccountInfo<Buffer> | null> {
		const pubkey = toPublicKey(address);
		return await this.connection.getAccountInfo(pubkey);
	}

	async getParsedAccountInfo(address: string): Promise<AccountInfo<ParsedAccountData | Buffer> | null> {
		const pubkey = toPublicKey(address);
		const result = await this.connection.getParsedAccountInfo(pubkey);
		return result.value;
	}

	async getTokenAccounts(address: string) {
		const pubkey = toPublicKey(address);
		const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(pubkey, {
			programId: TOKEN_PROGRAM_ID,
		});
		return tokenAccounts.value.map((account) => ({
			address: account.pubkey.toBase58(),
			...account.account.data,
		}));
	}

	async getTransactionHistory(address: string, limit: number = 10): Promise<ParsedTransactionWithMeta[]> {
		const pubkey = toPublicKey(address);
		const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit });
		
		const transactions: ParsedTransactionWithMeta[] = [];
		for (const sig of signatures) {
			const tx = await this.connection.getParsedTransaction(sig.signature, {
				maxSupportedTransactionVersion: 0,
			});
			if (tx) {
				transactions.push(tx);
			}
		}
		return transactions;
	}

	async requestAirdrop(address: string, amount: number): Promise<string> {
		if (this.credentials.network === 'mainnet-beta') {
			throw new Error('Airdrop is not available on mainnet');
		}
		const pubkey = toPublicKey(address);
		const signature = await this.connection.requestAirdrop(
			pubkey,
			solToLamports(amount)
		);
		await this.connection.confirmTransaction(signature, this.credentials.commitment);
		return signature;
	}

	async sendSol(toAddress: string, amount: number): Promise<string> {
		const keypair = this.getKeypair();
		const toPubkey = toPublicKey(toAddress);
		
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: keypair.publicKey,
				toPubkey,
				lamports: solToLamports(amount),
			})
		);

		const signature = await sendAndConfirmTransaction(
			this.connection,
			transaction,
			[keypair],
			{ commitment: this.credentials.commitment }
		);
		
		return signature;
	}

	async getTransaction(signature: string): Promise<ParsedTransactionWithMeta | null> {
		return await this.connection.getParsedTransaction(signature, {
			maxSupportedTransactionVersion: 0,
		});
	}

	async getTransactionStatus(signature: string) {
		const status = await this.connection.getSignatureStatus(signature);
		return status.value;
	}

	async simulateTransaction(transaction: Transaction) {
		return await this.connection.simulateTransaction(transaction);
	}

	async getRecentBlockhash() {
		const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();
		return { blockhash, lastValidBlockHeight };
	}

	async getTokenBalance(address: string, mintAddress: string) {
		const pubkey = toPublicKey(address);
		const mint = toPublicKey(mintAddress);
		
		const ata = await getAssociatedTokenAddress(mint, pubkey);
		
		try {
			const account = await getAccount(this.connection, ata);
			const mintInfo = await getMint(this.connection, mint);
			
			return {
				address: ata.toBase58(),
				amount: account.amount.toString(),
				decimals: mintInfo.decimals,
				uiAmount: Number(account.amount) / Math.pow(10, mintInfo.decimals),
			};
		} catch {
			return {
				address: ata.toBase58(),
				amount: '0',
				decimals: 0,
				uiAmount: 0,
			};
		}
	}

	async transferToken(
		mintAddress: string,
		toAddress: string,
		amount: number,
		decimals?: number
	): Promise<string> {
		const keypair = this.getKeypair();
		const mint = toPublicKey(mintAddress);
		const toPubkey = toPublicKey(toAddress);
		
		const mintInfo = await getMint(this.connection, mint);
		const tokenDecimals = decimals ?? mintInfo.decimals;
		
		const fromAta = await getAssociatedTokenAddress(mint, keypair.publicKey);
		const toAta = await getAssociatedTokenAddress(mint, toPubkey);
		
		const transaction = new Transaction();
		
		const toAtaInfo = await this.connection.getAccountInfo(toAta);
		if (!toAtaInfo) {
			transaction.add(
				createAssociatedTokenAccountInstruction(
					keypair.publicKey,
					toAta,
					toPubkey,
					mint,
					TOKEN_PROGRAM_ID,
					ASSOCIATED_TOKEN_PROGRAM_ID
				)
			);
		}
		
		const tokenAmount = BigInt(Math.floor(amount * Math.pow(10, tokenDecimals)));
		transaction.add(
			createTransferInstruction(fromAta, toAta, keypair.publicKey, tokenAmount)
		);
		
		const signature = await sendAndConfirmTransaction(
			this.connection,
			transaction,
			[keypair],
			{ commitment: this.credentials.commitment }
		);
		
		return signature;
	}

	async getTokenSupply(mintAddress: string) {
		const mint = toPublicKey(mintAddress);
		const supply = await this.connection.getTokenSupply(mint);
		return supply.value;
	}

	async createTokenAccount(mintAddress: string, ownerAddress?: string): Promise<string> {
		const keypair = this.getKeypair();
		const mint = toPublicKey(mintAddress);
		const owner = ownerAddress ? toPublicKey(ownerAddress) : keypair.publicKey;
		
		const ata = await getAssociatedTokenAddress(mint, owner);
		
		const transaction = new Transaction().add(
			createAssociatedTokenAccountInstruction(
				keypair.publicKey,
				ata,
				owner,
				mint,
				TOKEN_PROGRAM_ID,
				ASSOCIATED_TOKEN_PROGRAM_ID
			)
		);
		
		const signature = await sendAndConfirmTransaction(
			this.connection,
			transaction,
			[keypair],
			{ commitment: this.credentials.commitment }
		);
		
		return signature;
	}

	async getLargestTokenAccounts(mintAddress: string) {
		const mint = toPublicKey(mintAddress);
		const accounts = await this.connection.getTokenLargestAccounts(mint);
		return accounts.value;
	}

	async getNftMetadata(mintAddress: string) {
		const metaplex = this.getMetaplex();
		const mint = toPublicKey(mintAddress);
		const nft = await metaplex.nfts().findByMint({ mintAddress: mint });
		return nft;
	}

	async getNftsByOwner(ownerAddress: string) {
		const metaplex = this.getMetaplex();
		const owner = toPublicKey(ownerAddress);
		const nfts = await metaplex.nfts().findAllByOwner({ owner });
		return nfts;
	}

	async getStakeAccounts(address: string) {
		const pubkey = toPublicKey(address);
		const stakeAccounts = await this.connection.getParsedProgramAccounts(
			new PublicKey('Stake11111111111111111111111111111111111111'),
			{
				filters: [
					{
						memcmp: {
							offset: 12,
							bytes: pubkey.toBase58(),
						},
					},
				],
			}
		);
		return stakeAccounts;
	}

	async getStakeActivation(stakeAddress: string) {
		const pubkey = toPublicKey(stakeAddress);
		return await this.connection.getStakeActivation(pubkey);
	}

	async getValidators() {
		const voteAccounts = await this.connection.getVoteAccounts();
		return voteAccounts;
	}

	async getEpochInfo() {
		return await this.connection.getEpochInfo();
	}

	async getProgramAccounts(programId: string, filters?: GetProgramAccountsFilter[]) {
		const pubkey = toPublicKey(programId);
		return await this.connection.getParsedProgramAccounts(pubkey, { filters });
	}

	async getBlock(slot: number) {
		return await this.connection.getBlock(slot, {
			maxSupportedTransactionVersion: 0,
		});
	}

	async getBlockHeight() {
		return await this.connection.getBlockHeight();
	}

	async getSlot() {
		return await this.connection.getSlot();
	}

	async getBlockTime(slot: number) {
		return await this.connection.getBlockTime(slot);
	}

	async getClusterNodes(): Promise<ContactInfo[]> {
		return await this.connection.getClusterNodes();
	}

	async getHealth(): Promise<string> {
		try {
			await this.connection.getSlot();
			return 'ok';
		} catch (error) {
			return (error as Error).message;
		}
	}

	async getVersion() {
		return await this.connection.getVersion();
	}

	async getSupply() {
		return await this.connection.getSupply();
	}
}

export function createSolanaClient(credentials: ICredentialDataDecryptedObject): SolanaClient {
	return new SolanaClient(credentials as unknown as ISolanaCredentials);
}

export function formatError(error: unknown): Error {
	if (error instanceof Error) {
		const message = error.message;
		
		if (message.includes('blockhash not found')) {
			return new Error('Transaction expired. Please try again.');
		}
		if (message.includes('insufficient funds')) {
			return new Error('Insufficient funds for this transaction.');
		}
		if (message.includes('Invalid public key')) {
			return new Error('Invalid Solana address provided.');
		}
		
		return error;
	}
	return new Error(String(error));
}

export async function withRetry<T>(
	fn: () => Promise<T>,
	maxRetries: number = 3,
	baseDelayMs: number = 1000
): Promise<T> {
	let lastError: Error | undefined;
	
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = formatError(error);
			
			if (
				lastError.message.includes('Invalid') ||
				lastError.message.includes('insufficient funds')
			) {
				throw lastError;
			}
			
			const delay = baseDelayMs * Math.pow(2, attempt);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
	
	throw lastError;
}
