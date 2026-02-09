const fetch = require('node-fetch');

const WHALE_WALLET = '0x28C6c06298d514Db089934071355E5743bf21d60'; // Binance

async function testWallet() {
    console.log('🐋 Testing whale wallet:', WHALE_WALLET);
    console.log('');
    
    try {
        // Get balance
        const balanceRes = await fetch(
            `https://api.etherscan.io/api?module=account&action=balance&address=${WHALE_WALLET}&tag=latest&apikey=YourApiKeyToken`
        );
        const balance = await balanceRes.json();
        
        console.log('💰 Balance:', (parseInt(balance.result) / 1e18).toFixed(2), 'ETH');
        
        // Get recent transactions
        const txRes = await fetch(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${WHALE_WALLET}&startblock=0&endblock=99999999&page=1&offset=5&sort=desc&apikey=YourApiKeyToken`
        );
        const txData = await txRes.json();
        
        console.log('📊 Recent transactions:', txData.result?.length || 0);
        
        if (txData.result && txData.result.length > 0) {
            console.log('');
            console.log('Latest transaction:');
            const latest = txData.result[0];
            console.log('  From:', latest.from);
            console.log('  To:', latest.to);
            console.log('  Value:', (parseInt(latest.value) / 1e18).toFixed(4), 'ETH');
            console.log('  Time:', new Date(parseInt(latest.timeStamp) * 1000).toLocaleString());
        }
        
        console.log('');
        console.log('✅ Test successful!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testWallet();
