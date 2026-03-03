#!/usr/bin/env python3
"""
LLM Client - Groq API (ULTRA FAST!)
FREE: 14,400 requests/day
Response time: <1 second
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv

# Load API key
load_dotenv('/home/saad/pepeline-com/ai-agents/.env')

class LLMClient:
    def __init__(self, model='llama-3.1-8b-instant'):
        self.api_key = os.getenv('GROQ_API_KEY')
        
        if not self.api_key or self.api_key == 'your_api_key_here':
            raise Exception("⚠️ GROQ_API_KEY not set! Get one at https://console.groq.com/keys")
        
        self.client = Groq(api_key=self.api_key)
        self.model = model
        
        print(f"🧠 LLM Client initialized: Groq {model}")
        print(f"   Speed: ULTRA FAST (<1s)")
        print(f"   Free tier: 14,400 req/day")
    
    def analyze_sentiment(self, text, coin_symbol='BTC'):
        """
        Lightning-fast sentiment analysis
        """
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a crypto sentiment analyst. Reply ONLY with valid JSON, no other text."
                    },
                    {
                        "role": "user",
                        "content": f"""Analyze crypto sentiment for {coin_symbol}:

Text: "{text}"

Reply with JSON:
{{
  "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL",
  "confidence": 0-100,
  "reasoning": "brief 1-2 sentence explanation",
  "sarcasm_detected": true | false
}}"""
                    }
                ],
                temperature=0.3,
                max_tokens=150
            )
            
            response_text = completion.choices[0].message.content.strip()
            
            # Clean JSON
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0].strip()
            
            # Parse JSON
            result = json.loads(response_text)
            return result
            
        except Exception as e:
            print(f"⚠️ LLM error: {e}")
            return {
                'sentiment': 'NEUTRAL',
                'confidence': 50,
                'reasoning': 'Error in analysis',
                'sarcasm_detected': False
            }
    
    def analyze_trade_decision(self, signal_data, market_context):
        """
        Lightning-fast trade decision
        """
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an AI trading assistant. Reply ONLY with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": f"""Analyze this crypto trading signal:

Coin: {signal_data['symbol']}
Signal: {signal_data['signal']}
Strength: {signal_data['strength']}/100
Price: ${signal_data['price']}
24h Change: {market_context.get('price_change_24h', 0)}%

Market Context:
- Fear & Greed: {market_context.get('fear_greed', 50)}
- Social Sentiment: {market_context.get('social_sentiment', 'NEUTRAL')}

Should the agent execute? Reply JSON:
{{
  "decision": "EXECUTE" | "SKIP",
  "confidence": 0-100,
  "reasoning": "brief explanation why",
  "risk_level": "LOW" | "MEDIUM" | "HIGH",
  "suggested_position_size_pct": 0-100
}}"""
                    }
                ],
                temperature=0.5,
                max_tokens=200
            )
            
            response_text = completion.choices[0].message.content.strip()
            
            # Clean JSON
            if '```' in response_text:
                response_text = response_text.split('```')[1].replace('json', '').strip()
            
            result = json.loads(response_text)
            return result
            
        except Exception as e:
            print(f"⚠️ LLM error: {e}")
            return {
                'decision': 'SKIP',
                'confidence': 0,
                'reasoning': 'Error in analysis',
                'risk_level': 'HIGH',
                'suggested_position_size_pct': 0
            }
    
    def find_gems(self, token_data):
        """Fast gem analysis"""
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a crypto gem hunter. Reply ONLY with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": f"""Analyze new token {token_data['symbol']}:

Liquidity: ${token_data.get('liquidity', 0)}
Holders: {token_data.get('holders', 0)}
Age: {token_data.get('age_days', 0)} days
Verified: {token_data.get('verified', False)}

Rate 0-100. Reply JSON:
{{
  "gem_score": 0-100,
  "rating": "GEM" | "PROMISING" | "RISKY",
  "reasoning": "brief",
  "recommendation": "BUY" | "WATCH" | "AVOID"
}}"""
                    }
                ],
                temperature=0.4,
                max_tokens=150
            )
            
            response_text = completion.choices[0].message.content.strip()
            if '```' in response_text:
                response_text = response_text.split('```')[1].replace('json', '').strip()
            
            return json.loads(response_text)
            
        except Exception as e:
            print(f"⚠️ LLM error: {e}")
            return {
                'gem_score': 50,
                'rating': 'RISKY',
                'reasoning': 'Error',
                'recommendation': 'AVOID'
            }


if __name__ == '__main__':
    import time
    
    print("\n" + "="*60)
    print("⚡ GROQ API SPEED TEST")
    print("="*60 + "\n")
    
    llm = LLMClient()
    
    # Test 1: Sentiment
    print("Test 1: Sentiment Analysis...")
    start = time.time()
    result = llm.analyze_sentiment("Bitcoin just broke $100k! 🚀🚀🚀", "BTC")
    elapsed = time.time() - start
    
    print(json.dumps(result, indent=2))
    print(f"⏱️ Time: {elapsed:.2f}s")
    
    # Test 2: Trade Decision
    print("\nTest 2: Trade Decision...")
    start = time.time()
    signal = {
        'symbol': 'BTC',
        'signal': 'BUY',
        'strength': 85,
        'price': 95000
    }
    context = {
        'price_change_24h': 5.2,
        'fear_greed': 75,
        'social_sentiment': 'BULLISH'
    }
    decision = llm.analyze_trade_decision(signal, context)
    elapsed = time.time() - start
    
    print(json.dumps(decision, indent=2))
    print(f"⏱️ Time: {elapsed:.2f}s")
    
    print("\n" + "="*60)
    if elapsed < 2:
        print("✅ ULTRA FAST! Ready for production!")
    else:
        print("⚠️ Check internet connection")
    print("="*60 + "\n")
