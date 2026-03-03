#!/usr/bin/env python3
"""
Trading Agent LIVE - Integrated with Pepeline API + LLM
"""

import sys
sys.path.append('/home/saad/pepeline-com/ai-agents')

import json
import time
import requests
from datetime import datetime
from shared.llm_client import LLMClient

class LiveTradingAgent:
    def __init__(self, 
                 risk_level='medium',
                 max_position_size=1000,
                 api_base='http://localhost:3000',
                 use_llm=True):
        
        self.risk_level = risk_level
        self.max_position_size = max_position_size
        self.api_base = api_base
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
        
        print(f"🤖 LIVE Trading Agent initialized")
        print(f"   Risk Level: {risk_level}")
        print(f"   Max Position: ${max_position_size}")
        print(f"   LLM Reasoning: {'ENABLED' if use_llm else 'DISABLED'}")
        print(f"   API: {api_base}")
    
    def get_signals(self):
        """Fetch live signals from Pepeline API"""
        try:
            url = f"{self.api_base}/api/signals"
            print(f"📡 Fetching signals from {url}...")
            
            # INCREASED TIMEOUT: 30s instead of 10s
            resp = requests.get(url, timeout=30)
            
            if resp.status_code != 200:
                print(f"⚠️ API error: {resp.status_code}")
                return []
            
            data = resp.json()
            signals = data.get('signals', [])
            
            # Filter out signals with errors
            valid_signals = [s for s in signals if s.get('price', 0) > 0]
            
            print(f"📡 Fetched {len(valid_signals)} valid signals from API")
            return valid_signals
            
        except requests.exceptions.Timeout:
            print(f"⏱️ API timeout after 30s - server is slow, try again later")
            return []
        except Exception as e:
            print(f"❌ Error fetching signals: {e}")
            return []
    
    def analyze_with_llm(self, signal):
        """Get LLM reasoning on trade decision"""
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
        """Execute trade with full reasoning"""
        
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
            'status': 'SIMULATED'
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
        print(f"🤖 TRADE EXECUTED")
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
    
    def run_cycle(self):
        """Run one trading cycle"""
        print(f"\n{'='*70}")
        print(f"🔄 TRADING CYCLE - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*70}\n")
        
        signals = self.get_signals()
        
        if not signals:
            print("⚠️ No signals available - API might be slow or down")
            print("   Try again in next cycle...")
            return []
        
        trades_executed = []
        
        # Analyze top 3 signals only
        for signal in signals[:3]:
            print(f"\n📊 Analyzing {signal['symbol']}...")
            print(f"   Signal: {signal.get('signal', 'UNKNOWN')}")
            print(f"   Strength: {signal.get('strength', 0)}/100")
            print(f"   Price: ${signal.get('price', 0)}")
            
            llm_decision = self.analyze_with_llm(signal)
            trade = self.execute_trade(signal, llm_decision)
            
            if trade:
                trades_executed.append(trade)
        
        print(f"\n✅ Cycle complete: {len(trades_executed)} trades")
        return trades_executed
    
    def run_autonomous(self, interval_minutes=15):
        """Run agent autonomously"""
        print(f"\n🚀 Starting autonomous trading...")
        print(f"   Interval: {interval_minutes} minutes")
        print(f"   Press Ctrl+C to stop\n")
        
        try:
            while True:
                self.run_cycle()
                print(f"⏳ Next cycle in {interval_minutes} minutes...")
                time.sleep(interval_minutes * 60)
        except KeyboardInterrupt:
            print("\n\n⛔ Agent stopped")
            print(f"Total trades executed: {len(self.trade_history)}")


if __name__ == '__main__':
    risk = sys.argv[1] if len(sys.argv) > 1 else 'medium'
    max_size = int(sys.argv[2]) if len(sys.argv) > 2 else 1000
    use_llm = sys.argv[3].lower() != 'false' if len(sys.argv) > 3 else True
    
    agent = LiveTradingAgent(
        risk_level=risk,
        max_position_size=max_size,
        use_llm=use_llm
    )
    
    agent.run_autonomous(interval_minutes=15)
