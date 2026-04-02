/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Solana } from '../nodes/Solana/Solana.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Solana Node', () => {
  let node: Solana;

  beforeAll(() => {
    node = new Solana();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Solana');
      expect(node.description.name).toBe('solana');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        apiKey: 'test-key' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn() },
    };
  });

  describe('getAccountInfo operation', () => {
    it('should get account info successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          context: { slot: 12345 },
          value: { 
            lamports: 1000000000,
            owner: '11111111111111111111111111111111',
            executable: false,
            data: ['', 'base64']
          }
        },
        id: 1
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountInfo')
        .mockReturnValueOnce('So11111111111111111111111111111111111111112')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('base64');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle errors gracefully when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountInfo')
        .mockReturnValueOnce('invalid-pubkey');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid pubkey'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid pubkey');
    });
  });

  describe('getBalance operation', () => {
    it('should get account balance successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          context: { slot: 12345 },
          value: 1000000000
        },
        id: 1
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBalance')
        .mockReturnValueOnce('So11111111111111111111111111111111111111112')
        .mockReturnValueOnce('finalized');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getMultipleAccounts operation', () => {
    it('should get multiple accounts successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          context: { slot: 12345 },
          value: [
            { lamports: 1000000000, owner: '11111111111111111111111111111111', executable: false },
            { lamports: 2000000000, owner: '11111111111111111111111111111111', executable: false }
          ]
        },
        id: 1
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getMultipleAccounts')
        .mockReturnValueOnce('key1,key2')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('base64');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://api.mainnet-beta.solana.com' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should send transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('sendTransaction')
      .mockReturnValueOnce('test-transaction-data')
      .mockReturnValueOnce('base64')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"jsonrpc":"2.0","result":"2id3YC2jK9G5Wo2phDx4gJVAew8DcY5NAojnVuao8rkxwPYPe8cSwE5GzhEgJA2y8fVjDEo6iR6ykBvDxrTQrtpb","id":1}');

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('2id3YC2jK9G5Wo2phDx4gJVAew8DcY5NAojnVuao8rkxwPYPe8cSwE5GzhEgJA2y8fVjDEo6iR6ykBvDxrTQrtpb');
  });

  it('should simulate transaction successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('simulateTransaction')
      .mockReturnValueOnce('test-transaction-data')
      .mockReturnValueOnce('finalized')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('base64');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"jsonrpc":"2.0","result":{"err":null,"logs":[],"accounts":null,"unitsConsumed":150},"id":1}');

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result.err).toBe(null);
  });

  it('should get transaction details successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransaction')
      .mockReturnValueOnce('2id3YC2jK9G5Wo2phDx4gJVAew8DcY5NAojnVuao8rkxwPYPe8cSwE5GzhEgJA2y8fVjDEo6iR6ykBvDxrTQrtpb')
      .mockReturnValueOnce('finalized')
      .mockReturnValueOnce('base64');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"jsonrpc":"2.0","result":{"slot":430,"transaction":{"message":{"accountKeys":[],"header":{"numReadonlySignedAccounts":0,"numReadonlyUnsignedAccounts":1,"numRequiredSignatures":1},"instructions":[],"recentBlockhash":"11111111111111111111111111111111"},"signatures":[]}},"id":1}');

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result.slot).toBe(430);
  });

  it('should get signatures for address successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSignaturesForAddress')
      .mockReturnValueOnce('Vote111111111111111111111111111111111111111')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('{"jsonrpc":"2.0","result":[{"signature":"5h6xBEauJ3PK6SWCZ1PGjBvj8vDdWG3KpwATGy1ARAXFSDwt8GFXM7W5Ncn16wmqokgpiKRLuS83KUxyZyv2sUYv","slot":114,"err":null,"memo":null,"blockTime":null}],"id":1}');

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(Array.isArray(result[0].json.result)).toBe(true);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('sendTransaction');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Network error');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('sendTransaction');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    await expect(executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Network error');
  });
});

describe('Block Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.mainnet-beta.solana.com'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	it('should get block data successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getBlock')
			.mockReturnValueOnce(12345)
			.mockReturnValueOnce('finalized')
			.mockReturnValueOnce('json')
			.mockReturnValueOnce('full');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
			JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: {
					blockHeight: 12345,
					blockTime: 1234567890,
					transactions: []
				}
			})
		);

		const items = [{ json: {} }];
		const result = await executeBlockOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.blockHeight).toBe(12345);
	});

	it('should get blocks list successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getBlocks')
			.mockReturnValueOnce(12345)
			.mockReturnValueOnce(12350)
			.mockReturnValueOnce('finalized');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
			JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: [12345, 12346, 12347, 12348, 12349, 12350]
			})
		);

		const items = [{ json: {} }];
		const result = await executeBlockOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toHaveLength(6);
	});

	it('should get current slot successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getSlot')
			.mockReturnValueOnce('finalized');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
			JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: 12345
			})
		);

		const items = [{ json: {} }];
		const result = await executeBlockOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe(12345);
	});

	it('should get block height successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getBlockHeight')
			.mockReturnValueOnce('finalized');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
			JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: 12345
			})
		);

		const items = [{ json: {} }];
		const result = await executeBlockOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result).toBe(12345);
	});

	it('should get epoch info successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getEpochInfo')
			.mockReturnValueOnce('finalized');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
			JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				result: {
					absoluteSlot: 12345,
					blockHeight: 12340,
					epoch: 123,
					slotIndex: 45,
					slotsInEpoch: 432000
				}
			})
		);

		const items = [{ json: {} }];
		const result = await executeBlockOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.result.epoch).toBe(123);
	});

	it('should handle API errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSlot');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const items = [{ json: {} }];
		const result = await executeBlockOperations.call(mockExecuteFunctions, items);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getSlot');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const items = [{ json: {} }];

		await expect(executeBlockOperations.call(mockExecuteFunctions, items)).rejects.toThrow('API Error');
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		const items = [{ json: {} }];

		await expect(executeBlockOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('Token Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        apiKey: 'test-key',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('getTokenSupply', () => {
    it('should get token supply successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          context: { slot: 123456 },
          value: { amount: '1000000000', decimals: 9, uiAmount: 1.0 },
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenSupply')
        .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        .mockReturnValueOnce('finalized');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.mainnet-beta.solana.com',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key',
        },
        json: true,
        body: {
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenSupply',
          params: ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', { commitment: 'finalized' }],
        },
      });
    });

    it('should handle errors in getTokenSupply', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenSupply')
        .mockReturnValueOnce('invalid-mint')
        .mockReturnValueOnce('finalized');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid mint address'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'Invalid mint address' });
    });
  });

  describe('getTokenAccountBalance', () => {
    it('should get token account balance successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          context: { slot: 123456 },
          value: { amount: '500000000', decimals: 9, uiAmount: 0.5 },
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenAccountBalance')
        .mockReturnValueOnce('AyGCwnwxQMCqaU4ixReHt8h5W4dwmxU7eM3BEQBdWVca')
        .mockReturnValueOnce('confirmed');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getTokenAccountsByDelegate', () => {
    it('should get token accounts by delegate successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          context: { slot: 123456 },
          value: [
            {
              pubkey: 'AyGCwnwxQMCqaU4ixReHt8h5W4dwmxU7eM3BEQBdWVca',
              account: {
                data: { program: 'spl-token', parsed: { info: { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' } } },
              },
            },
          ],
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenAccountsByDelegate')
        .mockReturnValueOnce('4Nd1mBQtrMJVYVfKf2PJy9NZUZdTAsp7D4xWLs4gDB4T')
        .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('processed');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getTokenLargestAccounts', () => {
    it('should get token largest accounts successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          context: { slot: 123456 },
          value: [
            { address: 'AyGCwnwxQMCqaU4ixReHt8h5W4dwmxU7eM3BEQBdWVca', amount: '1000000000', decimals: 9 },
          ],
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenLargestAccounts')
        .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
        .mockReturnValueOnce('finalized');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Program Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				rpcUrl: 'https://api.mainnet-beta.solana.com',
				apiKey: 'test-key',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getProgramAccounts', () => {
		it('should get program accounts successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProgramAccounts')
				.mockReturnValueOnce('11111111111111111111111111111112')
				.mockReturnValueOnce('finalized')
				.mockReturnValueOnce('base64')
				.mockReturnValueOnce(false)
				.mockReturnValueOnce([])
				.mockReturnValueOnce([]);

			const mockResponse = {
				result: [
					{
						account: {
							data: 'dGVzdA==',
							executable: false,
							lamports: 1000000,
							owner: '11111111111111111111111111111112',
							rentEpoch: 250,
						},
						pubkey: 'TestAccount123456789',
					},
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProgramOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse.result);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.mainnet-beta.solana.com',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'getProgramAccounts',
					params: ['11111111111111111111111111111112', {
						commitment: 'finalized',
						encoding: 'base64',
						withContext: false,
					}],
				}),
				json: true,
			});
		});

		it('should handle RPC errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProgramAccounts')
				.mockReturnValueOnce('invalid-program-id')
				.mockReturnValueOnce('finalized')
				.mockReturnValueOnce('base64')
				.mockReturnValueOnce(false)
				.mockReturnValueOnce([])
				.mockReturnValueOnce([]);

			const mockErrorResponse = {
				error: {
					code: -32602,
					message: 'Invalid param: could not parse pubkey',
					data: 'Invalid public key format',
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

			await expect(
				executeProgramOperations.call(mockExecuteFunctions, [{ json: {} }])
			).rejects.toThrow('Solana RPC Error: Invalid param: could not parse pubkey');
		});
	});

	describe('getAccountInfo', () => {
		it('should get account info successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAccountInfo')
				.mockReturnValueOnce('11111111111111111111111111111112')
				.mockReturnValueOnce('finalized')
				.mockReturnValueOnce('base64')
				.mockReturnValueOnce([]);

			const mockResponse = {
				result: {
					value: {
						data: 'dGVzdA==',
						executable: true,
						lamports: 1000000,
						owner: '11111111111111111111111111111112',
						rentEpoch: 250,
					},
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeProgramOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse.result);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.mainnet-beta.solana.com',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: 1,
					method: 'getAccountInfo',
					params: ['11111111111111111111111111111112', {
						commitment: 'finalized',
						encoding: 'base64',
					}],
				}),
				json: true,
			});
		});

		it('should handle network errors with continue on fail', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAccountInfo')
				.mockReturnValueOnce('11111111111111111111111111111112')
				.mockReturnValueOnce('finalized')
				.mockReturnValueOnce('base64')
				.mockReturnValueOnce([]);

			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network timeout'));

			const result = await executeProgramOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Network timeout');
		});
	});
});

describe('Validator Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.mainnet-beta.solana.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getVoteAccounts operation', () => {
    it('should get vote accounts successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getVoteAccounts')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(false);

      const mockResponse = { jsonrpc: '2.0', id: 1, result: { current: [], delinquent: [] } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.mainnet-beta.solana.com',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-key' },
        body: { jsonrpc: '2.0', id: 1, method: 'getVoteAccounts', params: [{ commitment: 'finalized' }] },
        json: true,
      });
    });

    it('should handle getVoteAccounts errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getVoteAccounts');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getStakeActivation operation', () => {
    it('should get stake activation successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getStakeActivation')
        .mockReturnValueOnce('stake-account-pubkey')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce(300);

      const mockResponse = { jsonrpc: '2.0', id: 1, result: { state: 'active', active: 1000000000, inactive: 0 } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getStakeActivation errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getStakeActivation');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid stake account'));

      const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid stake account');
    });
  });

  describe('getInflationRate operation', () => {
    it('should get inflation rate successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getInflationRate');

      const mockResponse = { jsonrpc: '2.0', id: 1, result: { total: 0.08, validator: 0.074, foundation: 0.006, epoch: 300 } };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.mainnet-beta.solana.com',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-key' },
        body: { jsonrpc: '2.0', id: 1, method: 'getInflationRate', params: [] },
        json: true,
      });
    });

    it('should handle getInflationRate errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getInflationRate');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network Error'));

      const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Network Error');
    });
  });

  describe('getInflationReward operation', () => {
    it('should get inflation reward successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getInflationReward')
        .mockReturnValueOnce('addr1,addr2')
        .mockReturnValueOnce(299)
        .mockReturnValueOnce('finalized');

      const mockResponse = { jsonrpc: '2.0', id: 1, result: [{ amount: 1000000, effectiveSlot: 12345 }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.mainnet-beta.solana.com',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-key' },
        body: { 
          jsonrpc: '2.0', 
          id: 1, 
          method: 'getInflationReward', 
          params: [['addr1', 'addr2'], { epoch: 299, commitment: 'finalized' }] 
        },
        json: true,
      });
    });

    it('should handle getInflationReward errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getInflationReward');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));

      const result = await executeValidatorOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid address');
    });
  });
});
});
