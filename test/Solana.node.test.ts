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

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
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
        apiKey: 'test-api-key',
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

  test('getAccountInfo should return account information', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        context: { slot: 123456 },
        value: {
          owner: '11111111111111111111111111111112',
          lamports: 1000000000,
          data: ['', 'base64'],
          executable: false,
        },
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccountInfo';
        case 'pubkey': return 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        case 'commitment': return 'finalized';
        case 'encoding': return 'base64';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse.result, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.mainnet-beta.solana.com',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', { commitment: 'finalized', encoding: 'base64' }],
      }),
    });
  });

  test('getBalance should return account balance', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        context: { slot: 123456 },
        value: 1000000000,
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getBalance';
        case 'pubkey': return 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        case 'commitment': return 'finalized';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse.result, pairedItem: { item: 0 } }]);
  });

  test('getMultipleAccounts should return multiple account information', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        context: { slot: 123456 },
        value: [
          {
            owner: '11111111111111111111111111111112',
            lamports: 1000000000,
            data: ['', 'base64'],
            executable: false,
          },
          {
            owner: '11111111111111111111111111111112',
            lamports: 2000000000,
            data: ['', 'base64'],
            executable: false,
          },
        ],
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getMultipleAccounts';
        case 'pubkeys': return 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v, A4iUVr5KjmsLymUcv4eSKPedUtoaBceiPeGipKMYc69b';
        case 'commitment': return 'finalized';
        case 'encoding': return 'base64';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse.result, pairedItem: { item: 0 } }]);
  });

  test('getTokenAccountsByOwner should return token accounts', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        context: { slot: 123456 },
        value: [
          {
            pubkey: 'TokenAccountPubkey123',
            account: {
              owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              lamports: 2039280,
              data: {
                program: 'spl-token',
                parsed: {
                  info: {
                    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                    owner: 'OwnerPubkey123',
                    tokenAmount: {
                      amount: '1000000',
                      decimals: 6,
                      uiAmount: 1.0,
                    },
                  },
                  type: 'account',
                },
              },
            },
          },
        ],
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTokenAccountsByOwner';
        case 'pubkey': return 'OwnerPubkey123';
        case 'commitment': return 'finalized';
        case 'filterType': return 'mint';
        case 'mint': return 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: mockResponse.result, pairedItem: { item: 0 } }]);
  });

  test('should handle API errors', async () => {
    const mockErrorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32602,
        message: 'Invalid params',
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccountInfo';
        case 'pubkey': return 'invalid-pubkey';
        case 'commitment': return 'finalized';
        case 'encoding': return 'base64';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    const items = [{ json: {} }];
    
    await expect(executeAccountOperations.call(mockExecuteFunctions, items))
      .rejects
      .toThrow();
  });

  test('should handle network errors with continueOnFail', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccountInfo';
        case 'pubkey': return 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        case 'commitment': return 'finalized';
        case 'encoding': return 'base64';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const items = [{ json: {} }];
    const result = await executeAccountOperations.call(mockExecuteFunctions, items);

    expect(result).toEqual([{ json: { error: 'Network error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  describe('getTransaction operation', () => {
    it('should get transaction details successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: {
          slot: 123456,
          transaction: {
            message: {},
            signatures: ['test-signature'],
          },
          meta: {
            fee: 5000,
            status: { Ok: null },
          },
        },
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'getTransaction',
          signature: 'test-signature-123',
          commitment: 'confirmed',
          encoding: 'json',
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.slot).toBe(123456);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.mainnet-beta.solana.com',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-api-key',
        },
        body: expect.stringContaining('getTransaction'),
        json: false,
      });
    });

    it('should handle API errors', async () => {
      const mockErrorResponse = JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32602,
          message: 'Transaction not found',
        },
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        const params: any = {
          operation: 'getTransaction',
          signature: 'invalid-signature',
        };
        return params[paramName];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

      const items = [{ json: {} }];
      await expect(executeTransactionOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
    });
  });

  describe('getSignaturesForAddress operation', () => {
    it('should get signatures for address successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: [
          {
            signature: 'signature1',
            slot: 123456,
            err: null,
            memo: null,
          },
          {
            signature: 'signature2',
            slot: 123457,
            err: null,
            memo: null,
          },
        ],
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'getSignaturesForAddress',
          address: 'test-address-123',
          limit: 10,
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toHaveLength(2);
      expect(result[0].json[0].signature).toBe('signature1');
    });
  });

  describe('sendTransaction operation', () => {
    it('should send transaction successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: 'transaction-signature-hash',
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'sendTransaction',
          transaction: 'encoded-transaction-data',
          encoding: 'base58',
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe('transaction-signature-hash');
    });
  });

  describe('simulateTransaction operation', () => {
    it('should simulate transaction successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: {
          value: {
            err: null,
            logs: ['Program log: test'],
            accounts: null,
            unitsConsumed: 150,
          },
        },
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'simulateTransaction',
          transaction: 'encoded-transaction-data',
          commitment: 'processed',
          encoding: 'base64',
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.value.err).toBeNull();
      expect(result[0].json.value.unitsConsumed).toBe(150);
    });
  });

  describe('getRecentBlockhash operation', () => {
    it('should get recent blockhash successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: {
          value: {
            blockhash: 'recent-blockhash-123',
            feeCalculator: {
              lamportsPerSignature: 5000,
            },
          },
        },
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'getRecentBlockhash',
          commitment: 'finalized',
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.value.blockhash).toBe('recent-blockhash-123');
      expect(result[0].json.value.feeCalculator.lamportsPerSignature).toBe(5000);
    });
  });

  describe('getFeeForMessage operation', () => {
    it('should get fee for message successfully', async () => {
      const mockResponse = JSON.stringify({
        jsonrpc: '2.0',
        result: {
          value: 10000,
        },
        id: 1,
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        const params: any = {
          operation: 'getFeeForMessage',
          message: 'encoded-message-data',
          commitment: 'processed',
        };
        return params[paramName] || defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.value).toBe(10000);
    });
  });
});

describe('Token Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
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

  test('getTokenAccountBalance should return token account balance', async () => {
    const mockResponse = {
      result: {
        value: {
          amount: '1000000000',
          decimals: 6,
          uiAmount: 1000,
          uiAmountString: '1000',
        },
      },
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenAccountBalance')
      .mockReturnValueOnce('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.mainnet-beta.solana.com',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.stringContaining('getTokenAccountBalance'),
    });
  });

  test('getTokenSupply should return token supply', async () => {
    const mockResponse = {
      result: {
        value: {
          amount: '1000000000000',
          decimals: 6,
          uiAmount: 1000000,
          uiAmountString: '1000000',
        },
      },
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenSupply')
      .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('getTokenAccountsByDelegate should return token accounts', async () => {
    const mockResponse = {
      result: {
        value: [
          {
            account: {
              data: {
                parsed: {
                  info: {
                    tokenAmount: {
                      amount: '1000000',
                      decimals: 6,
                      uiAmount: 1,
                    },
                  },
                },
              },
            },
          },
        ],
      },
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenAccountsByDelegate')
      .mockReturnValueOnce('11111111111111111111111111111112')
      .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
      .mockReturnValueOnce('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('getTokenLargestAccounts should return largest accounts', async () => {
    const mockResponse = {
      result: {
        value: [
          {
            address: '11111111111111111111111111111112',
            amount: '1000000000',
            decimals: 6,
            uiAmount: 1000,
          },
        ],
      },
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenLargestAccounts')
      .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('getMinimumBalanceForRentExemption should return minimum balance', async () => {
    const mockResponse = {
      result: 2039280,
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMinimumBalanceForRentExemption')
      .mockReturnValueOnce(165)
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should handle API errors properly', async () => {
    const mockErrorResponse = {
      error: {
        code: -32602,
        message: 'Invalid params',
      },
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenAccountBalance')
      .mockReturnValueOnce('invalid-pubkey')
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    const items = [{ json: {} }];

    await expect(executeTokenOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
  });

  test('should handle unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    const items = [{ json: {} }];

    await expect(executeTokenOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Unknown operation: unknownOperation');
  });

  test('should continue on fail when enabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeTokenOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toContain('Unknown operation: unknownOperation');
  });
});

describe('NFT Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  test('should execute getAccountInfo operation successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        context: { slot: 123456 },
        value: {
          owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
          lamports: 1461600,
          data: { parsed: { info: { supply: '1' } } },
        },
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getAccountInfo';
        case 'pubkey':
          return '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
        case 'commitment':
          return 'confirmed';
        case 'encoding':
          return 'jsonParsed';
        default:
          return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.mainnet-beta.solana.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer test-api-key',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: [
          '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          {
            commitment: 'confirmed',
            encoding: 'jsonParsed',
          },
        ],
      }),
    });
  });

  test('should execute getTokenAccountsByOwner operation successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        context: { slot: 123456 },
        value: [
          {
            account: {
              data: { parsed: { info: { mint: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM' } } },
              owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
            },
            pubkey: 'C2jDL4pcwpE2pP5EryTGn842JJUJTcurPGZUAHgGp5e1',
          },
        ],
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getTokenAccountsByOwner';
        case 'pubkey':
          return '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
        case 'mint':
          return '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
        case 'programId':
          return 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        default:
          return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should execute getTokenSupply operation successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        context: { slot: 123456 },
        value: {
          amount: '1',
          decimals: 0,
          uiAmount: 1.0,
          uiAmountString: '1',
        },
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getTokenSupply';
        case 'mint':
          return '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
        case 'commitment':
          return 'confirmed';
        default:
          return null;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle API errors', async () => {
    const mockErrorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32602,
        message: 'Invalid account address',
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getAccountInfo';
        case 'pubkey':
          return 'invalid-address';
        default:
          return 'confirmed';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    await expect(
      executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow();
  });

  test('should handle network errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation':
          return 'getAccountInfo';
        case 'pubkey':
          return '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
        default:
          return 'confirmed';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Network error');
    expect(result[0].pairedItem).toEqual({ item: 0 });
  });
});

describe('Staking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  describe('getStakeActivation', () => {
    it('should successfully get stake activation info', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getStakeActivation';
        if (param === 'pubkey') return 'StakeAddress12345';
        if (param === 'commitment') return 'finalized';
        if (param === 'epoch') return 100;
        return '';
      });

      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          state: 'active',
          active: 124429280,
          inactive: 73287840,
        },
        id: 1,
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.mainnet-beta.solana.com',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
        body: {
          jsonrpc: '2.0',
          id: 1,
          method: 'getStakeActivation',
          params: ['StakeAddress12345', { commitment: 'finalized', epoch: 100 }],
        },
      });
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getStakeActivation';
        if (param === 'pubkey') return 'InvalidAddress';
        if (param === 'commitment') return 'finalized';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeStakingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid address');
    });
  });

  describe('getVoteAccounts', () => {
    it('should successfully get vote accounts', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getVoteAccounts';
        if (param === 'commitment') return 'finalized';
        if (param === 'votePubkey') return 'VoteAddress12345';
        return '';
      });

      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          current: [
            {
              votePubkey: 'VoteAddress12345',
              nodePubkey: 'NodeAddress12345',
              activatedStake: 42,
              epochVoteAccount: true,
              commission: 0,
            },
          ],
          delinquent: [],
        },
        id: 1,
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getInflationReward', () => {
    it('should successfully get inflation rewards', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getInflationReward';
        if (param === 'addresses') return 'Address1,Address2';
        if (param === 'commitment') return 'finalized';
        if (param === 'epoch') return 100;
        return '';
      });

      const mockResponse = {
        jsonrpc: '2.0',
        result: [
          {
            effectiveSlot: 432,
            amount: 2500,
            postBalance: 499999442500,
          },
          null,
        ],
        id: 1,
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getEpochInfo', () => {
    it('should successfully get epoch info', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getEpochInfo';
        if (param === 'commitment') return 'finalized';
        return '';
      });

      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          absoluteSlot: 166598,
          blockHeight: 166500,
          epoch: 27,
          slotIndex: 2790,
          slotsInEpoch: 8192,
        },
        id: 1,
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getDelegatedStake', () => {
    it('should successfully calculate delegated stake', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getDelegatedStake';
        if (param === 'commitment') return 'finalized';
        return '';
      });

      const mockVoteAccountsResponse = {
        jsonrpc: '2.0',
        result: {
          current: [
            {
              votePubkey: 'Vote1',
              nodePubkey: 'Node1',
              activatedStake: 1000000,
              commission: 5,
            },
            {
              votePubkey: 'Vote2',
              nodePubkey: 'Node2',
              activatedStake: 2000000,
              commission: 10,
            },
          ],
          delinquent: [],
        },
        id: 1,
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockVoteAccountsResponse);

      const result = await executeStakingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.result.totalDelegatedStake).toBe(3000000);
      expect(result[0].json.result.validatorCount).toBe(2);
      expect(result[0].json.result.validators).toHaveLength(2);
    });
  });
});
});
