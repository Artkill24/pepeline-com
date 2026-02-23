import csv
from io import StringIO

csv_data = """wallet_address,label,behavior_pattern,net_flow_7d,txn_count_7d,avg_tx_size,confidence,notes
0x85AB7Bc862902C9088D2466fAF4383E43689f742,distribution,large_outflows,negative,6,large,0.78,likely profit taking to CEX
0x5e8Eb774a215ed803Ed6DdaA4bACdD2B175254a3,accumulation,increasing_balance,positive,14,medium,0.74,steady inflow pattern
0x8b84ea014a4cDA04E9B57aEb4EA10296eeF66D70,dormant_to_active,spike_activity,mixed,21,medium,0.66,recent reactivation
0xe685F336C3829332D7b649A4892bD7aC4eD59648,distribution,large_outflows,negative,9,large,0.81,outflows to known liquidity routes
0x66804202E95baEC883902894e9E417655d3EFb23,accumulation,increasing_balance,positive,11,medium,0.72,gradual balance growth
0xe04aa77f2074f02bce88061C4Bec14Bd88F395b2,dormant_to_active,spike_activity,mixed,18,small,0.64,reactivated after inactivity
0xc2a3e789C2C5d3285c68C851b63654c0a7F51d23,distribution,large_outflows,negative,7,large,0.79,likely redistribution wallet
0xDCdE59c0101C102e96985931f2fB2B9E20F1cB55,accumulation,increasing_balance,positive,13,medium,0.73,inflow dominant
0x7db63a66bD32BC1D0aB87c49C60756ac20336fC3,dormant_to_active,spike_activity,mixed,16,small,0.65,activity spike detected
0x3868CC0c31A8B868C9AE98840C9bDab5C5DB65d4,distribution,large_outflows,negative,5,large,0.77,large transfers out
0x7DeD599622e765e8fCd173900d2C7e371A27E14b,accumulation,increasing_balance,positive,12,medium,0.71,consistent inflow behavior
0x1891084c6E20014bB86723Ee0014F9337eaf5541,dormant_to_active,spike_activity,mixed,19,small,0.63,recent transaction burst"""

reader = csv.DictReader(StringIO(csv_data))
wallets = list(reader)

print("=" * 60)
print("TOOLLAB DATASET ANALYSIS")
print("=" * 60)

print(f"\n📊 OVERVIEW:")
print(f"Total wallets: {len(wallets)}")

print(f"\n🏷️  LABEL DISTRIBUTION:")
labels = {}
for w in wallets:
    label = w['label']
    labels[label] = labels.get(label, 0) + 1
    
for label, count in sorted(labels.items()):
    pct = (count / len(wallets)) * 100
    print(f"  {label:20s}: {count:2d} wallets ({pct:.1f}%)")

acc_wallets = [w for w in wallets if w['label'] == 'accumulation']
dist_wallets = [w for w in wallets if w['label'] == 'distribution']

print(f"\n💡 PEPELINE + TOOLLAB INTEGRATION:")
print(f"  Current Pepeline: Fear & Greed = 9 (EXTREME FEAR)")
print(f"  ToolLab cluster: {len(acc_wallets)} accumulation vs {len(dist_wallets)} distribution")
print(f"  Signal: BALANCED (4 acc == 4 dist)")
print(f"\n  Combined interpretation:")
print(f"    → Market fear (index=9) + balanced whale activity")
print(f"    → Suggests: opportunity, but wait for accumulation > distribution")

print(f"\n✅ INTEGRATION VALUE:")
print(f"  1. Add behavioral layer to sentiment")
print(f"  2. Detect smart money divergence from retail sentiment")
print(f"  3. Improve signal accuracy (target: 73% → 75%+)")

print("\n" + "=" * 60)
