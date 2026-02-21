export const SMART_WALLETS = {
  ethereum: [
    { address: '0x8eb8a3b98659cce290402893d0123abb75e3ab28', label: 'Alameda Research', winRate: 0.72, category: 'Hedge Fund', network: 'Ethereum' },
    { address: '0x28c6c06298d514db089934071355e5743bf21d60', label: 'Binance 14', winRate: 0.68, category: 'Exchange', network: 'Ethereum' },
    { address: '0x220866b1a2219f40e72f5c628b65d54268ca3a9d', label: 'VanEck', winRate: 0.75, category: 'Institutional', network: 'Ethereum' },
    { address: '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503', label: 'Binance Hot', winRate: 0.70, category: 'Exchange', network: 'Ethereum' }
  ],
  solana: [
    { address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1', label: 'Raydium LP', winRate: 0.78, category: 'DeFi', network: 'Solana' },
    { address: 'GThUX1Atko4tqhN2NaiTazWSeFWMuiUvfFnyJyUghFMJ', label: 'Jupiter', winRate: 0.82, category: 'DeFi', network: 'Solana' }
  ]
};

export function getTopSmartWallets(network = 'all', minWinRate = 0.7) {
  if (network === 'all') {
    return [...SMART_WALLETS.ethereum, ...SMART_WALLETS.solana]
      .filter(w => w.winRate >= minWinRate)
      .sort((a, b) => b.winRate - a.winRate);
  }
  return (SMART_WALLETS[network] || [])
    .filter(w => w.winRate >= minWinRate)
    .sort((a, b) => b.winRate - a.winRate);
}
