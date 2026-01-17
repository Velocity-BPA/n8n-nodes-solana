/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { lamportsToSol, solToLamports, toPublicKey } from '../src/nodes/Solana/transport/solanaClient';

describe('Solana Transport Utilities', () => {
	describe('lamportsToSol', () => {
		it('should convert lamports to SOL', () => {
			expect(lamportsToSol(1000000000)).toBe(1);
			expect(lamportsToSol(500000000)).toBe(0.5);
			expect(lamportsToSol(0)).toBe(0);
		});
	});

	describe('solToLamports', () => {
		it('should convert SOL to lamports', () => {
			expect(solToLamports(1)).toBe(1000000000);
			expect(solToLamports(0.5)).toBe(500000000);
			expect(solToLamports(0)).toBe(0);
		});
	});

	describe('toPublicKey', () => {
		it('should convert valid address to PublicKey', () => {
			const validAddress = 'So11111111111111111111111111111111111111112';
			const pubkey = toPublicKey(validAddress);
			expect(pubkey.toBase58()).toBe(validAddress);
		});

		it('should throw error for invalid address', () => {
			expect(() => toPublicKey('invalid')).toThrow('Invalid Solana address');
		});
	});
});
