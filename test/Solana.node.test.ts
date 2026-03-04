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
      result: {
        context: { slot: 123456 },
        value: {
          data: ['', 'base64'],
          executable: false,
          lamports: 1000000,
          owner: '11111111111111111111111111111112',
          rentEpoch: 361,
        },
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccountInfo';
        case 'pubkey': return 'So11111111111111111111111111111111111111112';
        case 'commitment': return 'finalized';
        case 'encoding': return 'base64';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.mainnet-beta.solana.com',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      body: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getAccountInfo',
        params: ['So11111111111111111111111111111111111111112', { commitment: 'finalized', encoding: 'base64' }],
      },
      json: true,
    });
  });

  test('getBalance should return account balance', async () => {
    const mockResponse = {
      result: {
        context: { slot: 123456 },
        value: 1000000,
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getBalance';
        case 'pubkey': return 'So11111111111111111111111111111111111111112';
        case 'commitment': return 'finalized';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('getProgramAccounts should return program accounts', async () => {
    const mockResponse = {
      result: [
        {
          account: {
            data: ['', 'base64'],
            executable: false,
            lamports: 1000000,
            owner: '11111111111111111111111111111112',
            rentEpoch: 361,
          },
          pubkey: 'So11111111111111111111111111111111111111112',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getProgramAccounts';
        case 'programId': return '11111111111111111111111111111112';
        case 'commitment': return 'finalized';
        case 'encoding': return 'base64';
        case 'filters': return '[]';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('getMultipleAccounts should return multiple account information', async () => {
    const mockResponse = {
      result: {
        context: { slot: 123456 },
        value: [
          {
            data: ['', 'base64'],
            executable: false,
            lamports: 1000000,
            owner: '11111111111111111111111111111112',
            rentEpoch: 361,
          },
        ],
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getMultipleAccounts';
        case 'pubkeys': return 'So11111111111111111111111111111111111111112,4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R';
        case 'commitment': return 'finalized';
        case 'encoding': return 'base64';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('getLargestAccounts should return largest accounts', async () => {
    const mockResponse = {
      result: {
        context: { slot: 123456 },
        value: [
          {
            address: 'So11111111111111111111111111111111111111112',
            lamports: 1000000000,
          },
        ],
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getLargestAccounts';
        case 'commitment': return 'finalized';
        case 'filter': return 'circulating';
        default: return '';
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should handle API errors', async () => {
    const mockErrorResponse = {
      error: {
        code: -32602,
        message: 'Invalid params',
      },
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

    await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('Invalid params');
  });

  test('should handle unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return '';
    });

    await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('Unknown operation: unknownOperation');
  });

  test('should continue on fail when enabled', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return '';
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toContain('Unknown operation: unknownOperation');
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        rpcUrl: 'https://api.mainnet-beta.solana.com',
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

  test('should get transaction details successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        slot: 123456789,
        transaction: {
          signatures: ['test-signature'],
          message: {
            accountKeys: ['test-account'],
          },
        },
        meta: {
          fee: 5000,
          err: null,
        },
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTransaction';
      if (param === 'signature') return 'test-signature';
      if (param === 'commitment') return 'finalized';
      if (param === 'encoding') return 'json';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.mainnet-beta.solana.com',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTransaction',
        params: [
          'test-signature',
          {
            encoding: 'json',
            commitment: 'finalized',
          },
        ],
      }),
    });
  });

  test('should send transaction successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: 'transaction-signature-result',
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'sendTransaction';
      if (param === 'transaction') return 'encoded-transaction-data';
      if (param === 'encoding') return 'base64';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get signatures for address successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: [
        {
          signature: 'signature1',
          slot: 123456,
          err: null,
          memo: null,
        },
      ],
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getSignaturesForAddress';
      if (param === 'address') return 'test-address';
      if (param === 'limit') return 10;
      if (param === 'commitment') return 'confirmed';
      if (param === 'before') return '';
      if (param === 'until') return '';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle errors correctly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTransaction';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow();
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTransaction';
      return '';
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Token Resource', () => {
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

  test('getTokenAccountBalance should return token balance', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTokenAccountBalance';
      if (param === 'pubkey') return 'TokenAccountPublicKey123';
      if (param === 'commitment') return 'confirmed';
      return undefined;
    });

    const mockResponse = {
      result: {
        value: {
          amount: '1000000000',
          decimals: 9,
          uiAmount: 1.0,
          uiAmountString: '1',
        },
      },
    };

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
        'Authorization': 'Bearer test-api-key',
      },
      body: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountBalance',
        params: ['TokenAccountPublicKey123', { commitment: 'confirmed' }],
      },
      json: true,
    });
  });

  test('getTokenAccountsByOwner should return token accounts', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTokenAccountsByOwner';
      if (param === 'owner') return 'OwnerPublicKey123';
      if (param === 'filterByMint') return true;
      if (param === 'mintAddress') return 'MintAddress123';
      if (param === 'encoding') return 'jsonParsed';
      if (param === 'commitment') return 'confirmed';
      return undefined;
    });

    const mockResponse = {
      result: {
        value: [
          {
            account: {
              data: {
                parsed: {
                  info: {
                    tokenAmount: {
                      amount: '1000000000',
                      decimals: 9,
                    },
                  },
                },
              },
            },
            pubkey: 'TokenAccountPubkey123',
          },
        ],
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('getTokenSupply should return token supply', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
      if (param === 'operation') return 'getTokenSupply';
      if (param === 'mint') return 'MintAddress123';
      if (param === 'commitment') return 'finalized';
      return undefined;
    });

    const mockResponse = {
      result: {
        value: {
          amount: '1000000000000',
          decimals: 9,
          uiAmount: 1000.0,
          uiAmountString: '1000',
        },
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeTokenOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getTokenAccountBalance';
      if (param === 'pubkey') return 'InvalidPublicKey';
      if (param === 'commitment') return 'confirmed';
      return undefined;
    });

    const mockErrorResponse = {
      error: {
        code: -32602,
        message: 'Invalid param: could not find account',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    const items = [{ json: {} }];

    await expect(executeTokenOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
  });

  test('should handle network errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getTokenAccountBalance';
      if (param === 'pubkey') return 'TokenAccountPublicKey123';
      if (param === 'commitment') return 'confirmed';
      return undefined;
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const items = [{ json: {} }];
    const result = await executeTokenOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Network error' });
  });
});

describe('Block Resource', () => {
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

  test('should get block information successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        blockHeight: 123456,
        blockTime: 1625097600,
        blockhash: 'test-block-hash',
        parentSlot: 123455,
        transactions: [],
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlock')
      .mockReturnValueOnce(123456)
      .mockReturnValueOnce('finalized')
      .mockReturnValueOnce('json')
      .mockReturnValueOnce('full')
      .mockReturnValueOnce(true);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.mainnet-beta.solana.com',
      headers: { 'Content-Type': 'application/json' },
      body: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBlock',
        params: [123456, {
          commitment: 'finalized',
          encoding: 'json',
          transactionDetails: 'full',
          rewards: true,
        }],
      },
      json: true,
    });
  });

  test('should get blocks list successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: [123456, 123457, 123458],
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlocks')
      .mockReturnValueOnce(123456)
      .mockReturnValueOnce(123458)
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should get block height successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: 123456,
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlockHeight')
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe(123456);
  });

  test('should get current slot successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: 123456,
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getSlot')
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe(123456);
  });

  test('should get epoch info successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: {
        absoluteSlot: 123456,
        blockHeight: 98765,
        epoch: 250,
        slotIndex: 1000,
        slotsInEpoch: 432000,
        transactionCount: 5000000,
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEpochInfo')
      .mockReturnValueOnce('finalized');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should get block time successfully', async () => {
    const mockResponse = {
      jsonrpc: '2.0',
      result: 1625097600,
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlockTime')
      .mockReturnValueOnce(123456);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe(1625097600);
  });

  test('should handle API error', async () => {
    const mockErrorResponse = {
      jsonrpc: '2.0',
      error: {
        code: -32602,
        message: 'Invalid params',
      },
      id: 1,
    };

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBlock')
      .mockReturnValueOnce(-1);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    await expect(
      executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Invalid params');
  });

  test('should handle network error with continueOnFail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBlock');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const result = await executeBlockOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Network error');
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
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

  test('should get stake activation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      const params: any = {
        operation: 'getStakeActivation',
        pubkey: '4fYNw3dojWmQ4dXtSGE9epjRGy9pFSx62YypT7avPYvA',
        commitment: 'finalized',
      };
      return params[param] || defaultValue;
    });

    const mockResponse = {
      result: {
        state: 'active',
        active: 197717120,
        inactive: 0,
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeStakingOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
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
        params: ['4fYNw3dojWmQ4dXtSGE9epjRGy9pFSx62YypT7avPYvA', { commitment: 'finalized' }],
      },
    });
  });

  test('should get vote accounts successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      const params: any = {
        operation: 'getVoteAccounts',
        commitment: 'confirmed',
        keepUnstakedDelinquents: false,
      };
      return params[param] || defaultValue;
    });

    const mockResponse = {
      result: {
        current: [
          {
            votePubkey: '3ZT31jkAGhUaw8jsy4bTknwBMP8i4Eueh52By4zXcsVw',
            nodePubkey: 'AS3nKBQfKs8fJ8ncyHrdvo4FDT6S8HMRhD75JjCcyr1t',
            activatedStake: 42706372560845,
            epochVoteAccount: true,
            commission: 10,
            lastVote: 147,
            epochCredits: [[1, 64, 0], [2, 192, 64]],
          },
        ],
        delinquent: [],
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeStakingOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should get inflation reward successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      const params: any = {
        operation: 'getInflationReward',
        addresses: '6dmNQ5jwLeLk5REvio1JcMshcbvkYMwy26sJ8pbkvStu,BGsqMegLpV6n6Ve146sSX2dTjUMj3M92HnU8BbNRMhF2',
        commitment: 'finalized',
        epoch: 2,
      };
      return params[param] || defaultValue;
    });

    const mockResponse = {
      result: [
        {
          epoch: 2,
          effectiveSlot: 224,
          amount: 2500,
          postBalance: 499999442500,
        },
        null,
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeStakingOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should get inflation rate successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      return param === 'operation' ? 'getInflationRate' : undefined;
    });

    const mockResponse = {
      result: {
        total: 0.08,
        validator: 0.0672,
        foundation: 0.0128,
        epoch: 100,
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeStakingOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should get inflation governor successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
      const params: any = {
        operation: 'getInflationGovernor',
        commitment: 'finalized',
      };
      return params[param] || defaultValue;
    });

    const mockResponse = {
      result: {
        initial: 0.15,
        terminal: 0.015,
        taper: 0.15,
        foundation: 0.05,
        foundationTerm: 7.0,
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeStakingOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should get epoch schedule successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      return param === 'operation' ? 'getEpochSchedule' : undefined;
    });

    const mockResponse = {
      result: {
        slotsPerEpoch: 432000,
        leaderScheduleSlotOffset: 432000,
        warmup: false,
        firstNormalEpoch: 14,
        firstNormalSlot: 524256,
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeStakingOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse.result);
  });

  test('should handle API error', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      return param === 'operation' ? 'getInflationRate' : undefined;
    });

    const mockErrorResponse = {
      error: {
        code: -32601,
        message: 'Method not found',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    const items = [{ json: {} }];

    await expect(
      executeStakingOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Method not found');
  });

  test('should handle unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      return param === 'operation' ? 'unknownOperation' : undefined;
    });

    const items = [{ json: {} }];

    await expect(
      executeStakingOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });

  test('should continue on fail when error occurs', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      return param === 'operation' ? 'getInflationRate' : undefined;
    });
    
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const items = [{ json: {} }];
    const result = await executeStakingOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Network error' });
  });
});
});
