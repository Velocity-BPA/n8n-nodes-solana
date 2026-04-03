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

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
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
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  test('should get account info successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountInfo')
      .mockReturnValueOnce('11111111111111111111111111111112')
      .mockReturnValueOnce('finalized')
      .mockReturnValueOnce('base64');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: {
        value: {
          data: '',
          executable: false,
          lamports: 1000000000,
          owner: '11111111111111111111111111111111'
        }
      }
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.value.lamports).toBe(1000000000);
  });

  test('should handle getAccountInfo error', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountInfo')
      .mockReturnValueOnce('invalid-key')
      .mockReturnValueOnce('finalized')
      .mockReturnValueOnce('base64');

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid public key'));

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid public key');
  });

  test('should get balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalance')
      .mockReturnValueOnce('11111111111111111111111111111112')
      .mockReturnValueOnce('confirmed');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: {
        value: 5000000000
      }
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.value).toBe(5000000000);
  });

  test('should get multiple accounts successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMultipleAccounts')
      .mockReturnValueOnce('11111111111111111111111111111112,11111111111111111111111111111113')
      .mockReturnValueOnce('finalized')
      .mockReturnValueOnce('base64');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      jsonrpc: '2.0',
      id: 1,
      result: {
        value: [
          { lamports: 1000000000, data: '', executable: false },
          { lamports: 2000000000, data: '', executable: false }
        ]
      }
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.value).toHaveLength(2);
  });
});

describe('Transaction Resource', () => {
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

  describe('sendTransaction operation', () => {
    it('should send transaction successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendTransaction')
        .mockReturnValueOnce('base58EncodedTransaction')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('base58');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: 1,
        result: 'transactionSignature'
      });

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe('transactionSignature');
    });

    it('should handle sendTransaction error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendTransaction')
        .mockReturnValueOnce('base58EncodedTransaction')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('base58');
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getTransaction operation', () => {
    it('should get transaction successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTransaction')
        .mockReturnValueOnce('signature123')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('json');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: 1,
        result: { signature: 'signature123', blockTime: 1234567890 }
      });

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.result.signature).toBe('signature123');
    });
  });

  describe('getSignatureStatuses operation', () => {
    it('should get signature statuses successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getSignatureStatuses')
        .mockReturnValueOnce('sig1,sig2,sig3')
        .mockReturnValueOnce(false);
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: 1,
        result: { value: [{ slot: 123 }, { slot: 124 }, null] }
      });

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.result.value).toHaveLength(3);
    });
  });

  describe('getRecentBlockhash operation', () => {
    it('should get recent blockhash successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getRecentBlockhash')
        .mockReturnValueOnce('finalized');
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        jsonrpc: '2.0',
        id: 1,
        result: { 
          context: { slot: 123 },
          value: { blockhash: 'blockhash123', feeCalculator: { lamportsPerSignature: 5000 } }
        }
      });

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.result.value.blockhash).toBe('blockhash123');
    });
  });
});

describe('Token Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        rpcUrl: 'https://api.mainnet-beta.solana.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn() 
      },
    };
  });

  it('should get token supply successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenSupply')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      result: { context: { slot: 123 }, value: { amount: '1000000000', decimals: 6, uiAmount: 1000 } },
      id: 1
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result.value.amount).toBe('1000000000');
  });

  it('should get token account balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenAccountBalance')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi');

    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      result: { context: { slot: 123 }, value: { amount: '500000', decimals: 6, uiAmount: 0.5 } },
      id: 1
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result.value.amount).toBe('500000');
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenSupply')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('invalid-mint');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid mint address'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid mint address');
  });

  it('should get token accounts by owner successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenAccountsByOwner')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
      .mockReturnValueOnce('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM')
      .mockReturnValueOnce('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      result: { context: { slot: 123 }, value: [] },
      id: 1
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result.value).toEqual([]);
  });

  it('should get token largest accounts successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTokenLargestAccounts')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      result: { context: { slot: 123 }, value: [{ address: 'test', amount: '1000000', decimals: 6, uiAmount: 1 }] },
      id: 1
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result.value).toHaveLength(1);
  });
});

describe('Nft Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        endpoint: 'https://api.mainnet-beta.solana.com',
        apiKey: 'test-key'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  test('should get NFT metadata account info successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountInfo')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('base64')
      .mockReturnValueOnce('BUGuuhPsHpk8YZrL2GctsCtXxnepe7H8Fi9xHNztspWN');

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: {
        context: { slot: 123456 },
        value: {
          data: ['base64EncodedData', 'base64'],
          executable: false,
          lamports: 5616720,
          owner: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
        }
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNftOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.operation).toBe('getAccountInfo');
    expect(result[0].json.result).toEqual(mockResponse.result);
  });

  test('should get NFTs by creator successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getProgramAccounts')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('base64')
      .mockReturnValueOnce('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
      .mockReturnValueOnce('CreatorAddress123')
      .mockReturnValueOnce('');

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: [
        {
          account: {
            data: ['base64Data1', 'base64'],
            executable: false,
            lamports: 5616720,
            owner: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
          },
          pubkey: 'MetadataAddress1'
        }
      ]
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNftOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.operation).toBe('getProgramAccounts');
    expect(result[0].json.result).toEqual(mockResponse.result);
  });

  test('should get multiple NFT accounts successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMultipleAccounts')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('base64')
      .mockReturnValueOnce('addr1,addr2,addr3');

    const mockResponse = {
      jsonrpc: '2.0',
      id: 1,
      result: {
        context: { slot: 123456 },
        value: [
          {
            data: ['base64Data1', 'base64'],
            executable: false,
            lamports: 5616720,
            owner: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
          },
          null,
          {
            data: ['base64Data3', 'base64'],
            executable: false,
            lamports: 5616720,
            owner: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
          }
        ]
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeNftOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.operation).toBe('getMultipleAccounts');
    expect(result[0].json.result).toEqual(mockResponse.result);
  });

  test('should handle API error gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountInfo')
      .mockReturnValueOnce('confirmed')
      .mockReturnValueOnce('base64')
      .mockReturnValueOnce('InvalidAddress');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid account address'));

    const result = await executeNftOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid account address');
  });

  test('should handle unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeNftOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Staking Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ rpcUrl: 'https://api.mainnet-beta.solana.com' }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn() },
    };
  });
  
  describe('getStakeActivation', () => {
    it('should get stake account activation status successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 'test',
        result: { state: 'active', active: 100000000, inactive: 0 },
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getStakeActivation')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('StakeAccountPubkey123')
        .mockReturnValueOnce(null);
      
      const items = [{ json: {} }];
      const result = await executeStakingOperations.call(mockExecuteFunctions, items);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.mainnet-beta.solana.com',
        body: {
          jsonrpc: '2.0',
          id: expect.any(String),
          method: 'getStakeActivation',
          params: ['StakeAccountPubkey123', { commitment: 'finalized' }],
        },
        json: true,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    
    it('should handle stake activation errors', async () => {
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('RPC Error'));
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getStakeActivation')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('InvalidStakeAccount')
        .mockReturnValueOnce(null);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      
      const items = [{ json: {} }];
      const result = await executeStakingOperations.call(mockExecuteFunctions, items);
      
      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('RPC Error');
    });
  });
  
  describe('getVoteAccounts', () => {
    it('should get vote accounts successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 'test',
        result: { current: [], delinquent: [] },
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getVoteAccounts')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(false);
      
      const items = [{ json: {} }];
      const result = await executeStakingOperations.call(mockExecuteFunctions, items);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
  
  describe('getLeaderSchedule', () => {
    it('should get leader schedule successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 'test',
        result: { 'ValidatorPubkey123': [0, 1, 2] },
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getLeaderSchedule')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce(null)
        .mockReturnValueOnce('');
      
      const items = [{ json: {} }];
      const result = await executeStakingOperations.call(mockExecuteFunctions, items);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
  
  describe('getEpochInfo', () => {
    it('should get epoch info successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 'test',
        result: { absoluteSlot: 166598, blockHeight: 166500, epoch: 27, slotIndex: 2790, slotsInEpoch: 8192 },
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getEpochInfo')
        .mockReturnValueOnce('finalized');
      
      const items = [{ json: {} }];
      const result = await executeStakingOperations.call(mockExecuteFunctions, items);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
  
  describe('getInflationReward', () => {
    it('should get inflation rewards successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        id: 'test',
        result: [{ amount: 2500, effectiveSlot: 224, epoch: 4, postBalance: 499999442500 }],
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getInflationReward')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('StakeAccount1,StakeAccount2')
        .mockReturnValueOnce(null);
      
      const items = [{ json: {} }];
      const result = await executeStakingOperations.call(mockExecuteFunctions, items);
      
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

  describe('getAccountInfo operation', () => {
    it('should get program account info successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          context: { slot: 123456 },
          value: {
            data: 'base64data',
            executable: true,
            lamports: 1000000,
            owner: 'BPFLoaderUpgradeab1e11111111111111111111111',
            rentEpoch: 250,
          },
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountInfo')
        .mockReturnValueOnce('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('base64');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeProgramOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getAccountInfo errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountInfo')
        .mockReturnValueOnce('invalid-program-id')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('base64');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid program ID'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeProgramOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid program ID');
    });
  });

  describe('getProgramAccounts operation', () => {
    it('should get program accounts successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: [
          {
            account: {
              data: 'base64data',
              executable: false,
              lamports: 1000000,
              owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              rentEpoch: 250,
            },
            pubkey: 'AccountPublicKey123',
          },
        ],
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProgramAccounts')
        .mockReturnValueOnce('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('base64')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeProgramOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getMultipleAccounts operation', () => {
    it('should get multiple accounts successfully', async () => {
      const mockResponse = {
        jsonrpc: '2.0',
        result: {
          context: { slot: 123456 },
          value: [
            {
              data: 'base64data1',
              executable: false,
              lamports: 1000000,
              owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              rentEpoch: 250,
            },
            {
              data: 'base64data2',
              executable: false,
              lamports: 2000000,
              owner: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
              rentEpoch: 250,
            },
          ],
        },
        id: 1,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getMultipleAccounts')
        .mockReturnValueOnce('Account1,Account2')
        .mockReturnValueOnce('finalized')
        .mockReturnValueOnce('base64');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(JSON.stringify(mockResponse));

      const result = await executeProgramOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Block Resource', () => {
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
			},
		};
	});

	describe('getBlock operation', () => {
		it('should get block information successfully', async () => {
			const mockResponse = {
				jsonrpc: '2.0',
				result: {
					blockHeight: 166974442,
					blockTime: 1669835015,
					blockhash: 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N',
					parentSlot: 166974441,
					transactions: [],
				},
				id: 1,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getBlock')
				.mockReturnValueOnce(166974442)
				.mockReturnValueOnce('finalized')
				.mockReturnValueOnce('json')
				.mockReturnValueOnce('full');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle getBlock operation error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getBlock')
				.mockReturnValueOnce(166974442)
				.mockReturnValueOnce('finalized')
				.mockReturnValueOnce('json')
				.mockReturnValueOnce('full');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getBlockHeight operation', () => {
		it('should get block height successfully', async () => {
			const mockResponse = {
				jsonrpc: '2.0',
				result: 166974442,
				id: 1,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getBlockHeight')
				.mockReturnValueOnce('finalized');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle getBlockHeight operation error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getBlockHeight')
				.mockReturnValueOnce('finalized');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('Network Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Network Error');
		});
	});

	describe('getSlot operation', () => {
		it('should get slot successfully', async () => {
			const mockResponse = {
				jsonrpc: '2.0',
				result: 166974442,
				id: 1,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getSlot')
				.mockReturnValueOnce('finalized');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getEpochInfo operation', () => {
		it('should get epoch info successfully', async () => {
			const mockResponse = {
				jsonrpc: '2.0',
				result: {
					absoluteSlot: 166974442,
					blockHeight: 166974442,
					epoch: 388,
					slotIndex: 126442,
					slotsInEpoch: 432000,
					transactionCount: 22665540,
				},
				id: 1,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEpochInfo')
				.mockReturnValueOnce('finalized');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getClusterNodes operation', () => {
		it('should get cluster nodes successfully', async () => {
			const mockResponse = {
				jsonrpc: '2.0',
				result: [
					{
						pubkey: '8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q',
						gossip: '10.239.6.48:8001',
						tpu: '10.239.6.48:8004',
						rpc: '10.239.6.48:8899',
						version: '1.14.7',
					},
				],
				id: 1,
			};

			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getClusterNodes');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce(mockResponse);

			const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});
});
