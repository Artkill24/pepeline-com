#!/usr/bin/env python3
"""
Test Trading Agent with MOCK data (fast testing)
"""

import sys
sys.path.append('/home/saad/pepeline-com/ai-agents')

import json
import time
from datetime import datetime
from shared.llm_client import LLMClient

class MockTradingAgent:
    def __init__(self, risk_level='medium', max_position_size=1000, use_llm=True):
        self.risk_level = risk_level
        self.max_position_size = max_position_size
        self.use_llm = use_llm
        
        if use_llm:
            self.llm = LLMClient()
        
        self.risk_params = {
            'low': {'min_strength': 85, 'max_trades_per_day': 2},
            'medium': {'min_strength': 75, 'max_trades_per_day': 5},
            'high': {'min_strength': 65, 'max_trades_per_day': 10}
        }
        
        self.positions = {}
        self.trades_today = 0
        self.trade_history = []
        
        print(f"🤖 MOCK Trading Agent initialized")
        print(f"   Risk Level: {risk_level}")
        print(f"   Max Position: ${max_position_size}")
        print(f"   LLM Reasoning: {'ENABLED' if use_llm else 'DISABLED'}")
        print(f"   Data: MOCK (for testing)")
    
    def get_mock_signals(self):
        """Return mock signals for testing"""
        print("📡 Using MOCK signals (instant, for testing)...")
        
        return [
            {
                'symbol': 'BTC',
                'signal': 'BUY',
                'strength': 85,
                'confidence': 'HIGH',
                'price': 95000,
                'change24h': 3.5
            },
            {
                'symbol': 'ETH',
                'signal': 'BUY',
                'strength': 78,
                'confidence': 'MEDIUM',
                'price': 3500,
                'change24h': 2.1
            },
            {
                'symbol': 'SOL',
                'signal': 'HOLD',
                'strength': 65,
                'confidence': 'MEDIUM',
                'price': 145,
                'change24h': -0.5
            },
            {
                'symbol': 'DOGE',
                'signal': 'SELL',
                'strength': 45,
                'confidence': 'LOW',
                'price': 0.15,
                'change24h': -8.2
            }
        ]
    
    def analyze_with_llm(self, signal):
        """Get LLM reasoning"""
        if not self.use_llm:
            return None
        
        print(f"  🧠 Consulting LLM for {signal['symbol']}...")
        
        context = {
            'price_change_24h': signal.get('change24h', 0),
            'fear_greed': 50,
            'social_sentiment': 'NEUTRAL'
        }
        
        decision = self.llm.analyze_trade_decision(signal, context)
        
        print(f"     LLM Decision: {decision['decision']}")
        print(f"     Confidence: {decision['confidence']}%")
        print(f"     Reasoning: {decision['reasoning']}")
        
        return decision
    
    def should_execute_trade(self, signal, llm_decision=None):
        """Decide if trade should execute"""
        params = self.risk_params[self.risk_level]
        
        if signal['strength'] < params['min_strength']:
            return False, f"Strength {signal['strength']} < {params['min_strength']}"
        
        if self.trades_today >= params['max_trades_per_day']:
            return False, f"Daily limit reached"
        
        if signal.get('confidence') == 'LOW':
            return False, "Low confidence signal"
        
        if llm_decision and llm_decision['decision'] == 'SKIP':
            return False, f"LLM: {llm_decision['reasoning']}"
        
        return True, "All checks passed"
    
    def execute_trade(self, signal, llm_decision=None):
        """Execute trade"""
        should_execute, reason = self.should_execute_trade(signal, llm_decision)
        
        if not should_execute:
            print(f"  ⏭️ Skipping {signal['symbol']}: {reason}")
            return None
        
        position_size = min(self.max_position_size * 0.75, 1000)
        
        trade = {
            'timestamp': datetime.now().isoformat(),
            'coin': signal['symbol'],
            'action': signal['signal'],
            'position_size': position_size,
            'entry_price': signal.get('price', 0),
            'strength': signal['strength'],
            'llm_reasoning': llm_decision['reasoning'] if llm_decision else None,
            'status': 'SIMULATED (MOCK TEST)'
        }
        
        if trade['action'] == 'BUY':
            self.positions[signal['symbol']] = trade
            self.trades_today += 1
        
        self.trade_history.append(trade)
        self._print_trade(trade)
        
        return trade
    
    def _print_trade(self, trade):
        """Pretty print trade"""
        print(f"\n{'='*70}")
        print(f"🤖 TRADE EXECUTED (MOCK)")
        print(f"{'='*70}")
        print(f"Coin: {trade['coin']}")
        print(f"Action: {trade['action']}")
        print(f"Size: ${trade['position_size']}")
        print(f"Price: ${trade['entry_price']}")
        print(f"Strength: {trade['strength']}/100")
        
        if trade.get('llm_reasoning'):
            print(f"\n🧠 LLM Reasoning:")
            print(f"   {trade['llm_reasoning']}")
        
        print(f"{'='*70}\n")
    
    def run_test_cycle(self):
        """Run one test cycle"""
        print(f"\n{'='*70}")
        print(f"🧪 MOCK TEST CYCLE - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*70}\n")
        
        signals = self.get_mock_signals()
        
        print(f"Found {len(signals)} mock signals\n")
        
        trades_executed = []
        
        for signal in signals:
            print(f"\n📊 Analyzing {signal['symbol']}...")
            print(f"   Signal: {signal.get('signal', 'UNKNOWN')}")
            print(f"   Strength: {signal.get('strength', 0)}/100")
            print(f"   Price: ${signal.get('price', 0)}")
            
            llm_decision = self.analyze_with_llm(signal)
            trade = self.execute_trade(signal, llm_decision)
            
            if trade:
                trades_executed.append(trade)
        
        print(f"\n{'='*70}")
        print(f"✅ TEST COMPLETE")
        print(f"{'='*70}")
        print(f"Trades Executed: {len(trades_executed)}")
        print(f"Trades Skipped: {len(signals) - len(trades_executed)}")
        print(f"Open Positions: {len(self.positions)}")
        print(f"{'='*70}\n")
        
        return trades_executed


if __name__ == '__main__':
    print("\n🧪 TRADING AGENT MOCK TEST")
    print("=" * 70)
    print("This uses fake data to test LLM reasoning without API")
    print("=" * 70 + "\n")
    
    agent = MockTradingAgent(
        risk_level='medium',
        max_position_size=1000,
        use_llm=True
    )
    
    # Run test
    trades = agent.run_test_cycle()
    
    # Show summary
    if trades:
        print("📝 TRADE SUMMARY:")
        for i, trade in enumerate(trades, 1):
            print(f"{i}. {trade['action']} {trade['coin']} @ ${trade['entry_price']} (${trade['position_size']})")
    
    print("\n✅ Mock test complete! Agent is working correctly.")
    print("   Ready to connect to real API when it's optimized.\n")
