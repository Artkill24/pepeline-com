#!/usr/bin/env python3
"""
Portfolio Manager Agent - Auto-rebalance based on targets
"""

class PortfolioAgent:
    def __init__(self, targets: dict):
        """
        Args:
            targets: {'BTC': 40, 'ETH': 30, 'SOL': 20, 'ALTS': 10}  # Percentages
        """
        self.targets = targets
        print(f"💼 Portfolio Agent initialized")
        print(f"   Targets: {targets}")
    
    def get_current_allocation(self, portfolio: dict) -> dict:
        """Calculate current % allocation"""
        total = sum(portfolio.values())
        return {k: (v/total)*100 for k, v in portfolio.items()}
    
    def calculate_rebalance(self, portfolio: dict) -> list:
        """Calculate trades needed to rebalance"""
        current = self.get_current_allocation(portfolio)
        trades = []
        
        for asset, target_pct in self.targets.items():
            current_pct = current.get(asset, 0)
            diff = target_pct - current_pct
            
            if abs(diff) > 5:  # Rebalance if >5% off target
                action = 'BUY' if diff > 0 else 'SELL'
                amount = abs(diff) / 100 * sum(portfolio.values())
                
                trades.append({
                    'asset': asset,
                    'action': action,
                    'amount': amount,
                    'reason': f"Rebalance {current_pct:.1f}% → {target_pct}%"
                })
        
        return trades
    
    def execute_rebalance(self, trades: list):
        """Execute rebalance trades"""
        print(f"\n🔄 Executing rebalance...")
        
        for trade in trades:
            print(f"  {trade['action']} ${trade['amount']:.2f} of {trade['asset']}")
            print(f"    Reason: {trade['reason']}")


if __name__ == '__main__':
    # Example
    portfolio = {
        'BTC': 5000,
        'ETH': 2000,
        'SOL': 1500,
        'ALTS': 500
    }
    
    targets = {'BTC': 40, 'ETH': 30, 'SOL': 20, 'ALTS': 10}
    
    agent = PortfolioAgent(targets)
    trades = agent.calculate_rebalance(portfolio)
    
    if trades:
        agent.execute_rebalance(trades)
    else:
        print("✅ Portfolio already balanced")
