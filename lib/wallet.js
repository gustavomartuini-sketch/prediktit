// Crypto wallet utilities for MetaMask / WalletConnect integration
// Client-side only - use in React components with 'use client'

import { ethers } from 'ethers';

export class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
  }

  // Check if MetaMask is installed
  static isMetaMaskAvailable() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  // Connect to MetaMask
  async connectMetaMask() {
    if (!WalletService.isMetaMaskAvailable()) {
      throw new Error('MetaMask not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.address = accounts[0];

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        this.address = accounts[0] || null;
        window.dispatchEvent(new CustomEvent('walletChanged', { detail: { address: this.address } }));
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      return {
        address: this.address,
        chainId: await this.getChainId(),
      };
    } catch (error) {
      if (error.code === 4001) {
        throw new Error('Connection rejected by user');
      }
      throw error;
    }
  }

  // Sign a message for authentication
  async signMessage(message) {
    if (!this.signer) throw new Error('Wallet not connected');
    return await this.signer.signMessage(message);
  }

  // Generate auth message
  static generateAuthMessage(address, nonce) {
    return `Sign this message to authenticate with PrediktIt.\n\nWallet: ${address}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
  }

  // Get current chain ID
  async getChainId() {
    if (!this.provider) return null;
    const network = await this.provider.getNetwork();
    return Number(network.chainId);
  }

  // Get ETH balance
  async getBalance() {
    if (!this.provider || !this.address) return '0';
    const balance = await this.provider.getBalance(this.address);
    return ethers.formatEther(balance);
  }

  // Switch to a specific network
  async switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      // Chain not added, try to add it
      if (error.code === 4902) {
        const networks = {
          137: {
            chainId: '0x89',
            chainName: 'Polygon Mainnet',
            rpcUrls: ['https://polygon-rpc.com'],
            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
            blockExplorerUrls: ['https://polygonscan.com'],
          },
          42161: {
            chainId: '0xa4b1',
            chainName: 'Arbitrum One',
            rpcUrls: ['https://arb1.arbitrum.io/rpc'],
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://arbiscan.io'],
          },
          8453: {
            chainId: '0x2105',
            chainName: 'Base',
            rpcUrls: ['https://mainnet.base.org'],
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://basescan.org'],
          },
        };

        if (networks[chainId]) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networks[chainId]],
          });
        }
      }
      throw error;
    }
  }

  // Send ETH (for deposits)
  async sendTransaction(to, amountInEth) {
    if (!this.signer) throw new Error('Wallet not connected');
    const tx = await this.signer.sendTransaction({
      to,
      value: ethers.parseEther(amountInEth.toString()),
    });
    return await tx.wait();
  }

  // Disconnect
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.address = null;
  }
}

// Singleton instance
let walletInstance = null;
export function getWallet() {
  if (!walletInstance) walletInstance = new WalletService();
  return walletInstance;
}
