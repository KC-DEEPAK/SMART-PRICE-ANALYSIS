const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

// Your CSV file path
const YOUR_CSV_FILE_PATH = 'C:\\Users\\Deepak K C\\Desktop\\best_time_to_sell_crop\\backend\\data\\full_daily_prices.csv';

// Store your CSV data in memory
let cropData = [];
let allMarkets = new Set();
let allCrops = new Set();

// Read CSV file from your specified path
function loadCSVData() {
    return new Promise((resolve, reject) => {
        const csvFilePath = YOUR_CSV_FILE_PATH;
        
        console.log(`📁 Loading CSV data from: ${csvFilePath}`);
        
        // Check if file exists
        if (!fs.existsSync(csvFilePath)) {
            const error = new Error(`CSV file not found at: ${csvFilePath}`);
            console.error('❌', error.message);
            reject(error);
            return;
        }

        const results = [];
        
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', () => {
                if (results.length === 0) {
                    reject(new Error('CSV file is empty'));
                    return;
                }
                
                cropData = results;
                console.log(`✅ Successfully loaded ${results.length} records from CSV`);
                console.log('📊 First row sample:', results[0]);
                console.log('🔍 Available columns:', Object.keys(results[0]));
                
                // Extract all markets and crops
                extractMarketsAndCrops(results);
                resolve(results);
            })
            .on('error', (error) => {
                console.error('❌ Error reading CSV:', error);
                reject(error);
            });
    });
}

function extractMarketsAndCrops(data) {
    data.forEach(row => {
        // Auto-detect market column
        const marketKeys = Object.keys(row).filter(key => 
            key.toLowerCase().includes('market') || 
            key.toLowerCase().includes('mandi') ||
            key.toLowerCase().includes('location')
        );
        
        // Auto-detect crop column
        const cropKeys = Object.keys(row).filter(key => 
            key.toLowerCase().includes('crop') || 
            key.toLowerCase().includes('commodity') ||
            key.toLowerCase().includes('product')
        );

        if (marketKeys.length > 0 && row[marketKeys[0]]) {
            allMarkets.add(row[marketKeys[0]].trim());
        }
        if (cropKeys.length > 0 && row[cropKeys[0]]) {
            allCrops.add(row[cropKeys[0]].trim());
        }
    });

    console.log(`🏪 Found ${allMarkets.size} markets:`, Array.from(allMarkets).slice(0, 5));
    console.log(`🌾 Found ${allCrops.size} crops:`, Array.from(allCrops).slice(0, 5));
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        csvPath: YOUR_CSV_FILE_PATH,
        dataLoaded: cropData.length > 0,
        recordCount: cropData.length,
        marketsCount: allMarkets.size,
        cropsCount: allCrops.size
    });
});

// Get all markets
app.get('/api/markets', (req, res) => {
    res.json({
        success: true,
        markets: Array.from(allMarkets).sort(),
        count: allMarkets.size
    });
});

// Get all crops
app.get('/api/crops', (req, res) => {
    res.json({
        success: true,
        crops: Array.from(allCrops).sort(),
        count: allCrops.size
    });
});

// Get market analysis
app.get('/api/market-analysis', (req, res) => {
    try {
        if (cropData.length === 0) {
            return res.status(500).json({
                success: false,
                error: 'No data loaded from CSV file'
            });
        }

        const marketAnalysis = analyzeMarketData(cropData);
        res.json({
            success: true,
            data: marketAnalysis,
            stats: getMarketStats(marketAnalysis),
            source: YOUR_CSV_FILE_PATH
        });
    } catch (error) {
        console.error('Market analysis error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get crop analysis for specific market
app.get('/api/market/:marketName/crops', (req, res) => {
    try {
        const marketName = req.params.marketName;
        const cropAnalysis = analyzeCropsForMarket(cropData, marketName);
        
        res.json({
            success: true,
            market: marketName,
            data: cropAnalysis,
            cropCount: Object.keys(cropAnalysis).length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get detailed analysis for specific crop and market
app.get('/api/analysis/:market/:crop', (req, res) => {
    try {
        const { market, crop } = req.params;
        const analysis = analyzeCropMarketData(cropData, crop, market);
        
        res.json({
            success: true,
            market: market,
            crop: crop,
            analysis: analysis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Market analysis function
function analyzeMarketData(data) {
    const analysis = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Auto-detect columns
    const firstRow = data[0] || {};
    const columnMap = detectColumns(firstRow);

    console.log('🔍 Analyzing market data with columns:', columnMap);

    data.forEach(row => {
        const crop = row[columnMap.crop];
        const market = row[columnMap.market] || 'Unknown Market';
        let monthValue = row[columnMap.month];
        let price = parseFloat(row[columnMap.price]);

        if (!crop || !market || !monthValue || isNaN(price)) return;

        // Extract month
        const month = extractMonth(monthValue);
        if (month === null || isNaN(price)) return;

        // Initialize market analysis
        if (!analysis[market]) {
            analysis[market] = {
                name: market,
                crops: {},
                monthlyData: new Array(12).fill(null).map(() => ({ prices: [], total: 0, count: 0 })),
                totalTransactions: 0,
                avgPrice: 0,
                priceRange: { min: Infinity, max: -Infinity }
            };
        }

        const marketData = analysis[market];
        
        // Add to monthly data
        marketData.monthlyData[month].prices.push(price);
        marketData.monthlyData[month].total += price;
        marketData.monthlyData[month].count++;
        
        // Update price range
        marketData.priceRange.min = Math.min(marketData.priceRange.min, price);
        marketData.priceRange.max = Math.max(marketData.priceRange.max, price);
        
        marketData.totalTransactions++;

        // Initialize crop data for this market
        if (!marketData.crops[crop]) {
            marketData.crops[crop] = {
                name: crop,
                transactions: 0,
                avgPrice: 0,
                monthlyPrices: new Array(12).fill(null).map(() => [])
            };
        }

        // Add crop data
        marketData.crops[crop].monthlyPrices[month].push(price);
        marketData.crops[crop].transactions++;
    });

    // Calculate averages and insights
    Object.keys(analysis).forEach(market => {
        const marketData = analysis[market];
        
        // Calculate market averages
        let totalPrice = 0;
        let totalCount = 0;
        
        marketData.monthlyAverages = [];
        marketData.monthlyData.forEach(monthData => {
            const avg = monthData.count > 0 ? monthData.total / monthData.count : null;
            marketData.monthlyAverages.push(avg);
            if (avg !== null) {
                totalPrice += monthData.total;
                totalCount += monthData.count;
            }
        });
        
        marketData.avgPrice = totalCount > 0 ? totalPrice / totalCount : 0;

        // Calculate crop averages
        Object.keys(marketData.crops).forEach(crop => {
            const cropData = marketData.crops[crop];
            let cropTotal = 0;
            let cropCount = 0;
            
            cropData.monthlyAverages = [];
            cropData.monthlyPrices.forEach((prices, month) => {
                const avg = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
                cropData.monthlyAverages.push(avg);
                if (avg !== null) {
                    cropTotal += prices.reduce((a, b) => a + b, 0);
                    cropCount += prices.length;
                }
            });
            
            cropData.avgPrice = cropCount > 0 ? cropTotal / cropCount : 0;
        });

        // Generate market insights
        generateMarketInsights(marketData, months);
    });

    console.log(`✅ Market analysis complete. Analyzed ${Object.keys(analysis).length} markets`);
    return analysis;
}

// Analyze crops for specific market
function analyzeCropsForMarket(data, marketName) {
    const analysis = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const columnMap = detectColumns(data[0] || {});

    data.forEach(row => {
        const crop = row[columnMap.crop];
        const market = row[columnMap.market];
        let monthValue = row[columnMap.month];
        let price = parseFloat(row[columnMap.price]);

        if (!crop || market !== marketName || !monthValue || isNaN(price)) return;

        const month = extractMonth(monthValue);
        if (month === null) return;

        if (!analysis[crop]) {
            analysis[crop] = {
                name: crop,
                monthlyPrices: new Array(12).fill(null).map(() => []),
                transactions: 0,
                totalPrice: 0
            };
        }

        analysis[crop].monthlyPrices[month].push(price);
        analysis[crop].transactions++;
        analysis[crop].totalPrice += price;
    });

    // Calculate averages and insights for each crop
    Object.keys(analysis).forEach(crop => {
        const cropData = analysis[crop];
        cropData.monthlyAverages = [];
        cropData.bestMonths = [];
        cropData.worstMonths = [];

        let validMonths = [];
        for (let month = 0; month < 12; month++) {
            const prices = cropData.monthlyPrices[month];
            const avg = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
            cropData.monthlyAverages.push(avg);
            
            if (avg !== null) {
                validMonths.push({ month, price: avg });
            }
        }

        // Sort by price to find best/worst months
        validMonths.sort((a, b) => b.price - a.price);
        cropData.bestMonths = validMonths.slice(0, 3).map(m => m.month);
        cropData.worstMonths = validMonths.slice(-3).map(m => m.month);
        cropData.avgPrice = cropData.totalPrice / cropData.transactions;

        // Generate crop insights
        if (validMonths.length > 0) {
            const maxPrice = Math.max(...validMonths.map(m => m.price));
            const minPrice = Math.min(...validMonths.map(m => m.price));
            const priceRange = ((maxPrice - minPrice) / minPrice * 100).toFixed(1);
            
            cropData.insights = [
                `Best months: ${cropData.bestMonths.map(m => months[m]).join(', ')}`,
                `Price variation: ${priceRange}%`,
                `Total transactions: ${cropData.transactions}`
            ];
        }
    });

    return analysis;
}

// Helper functions
function detectColumns(firstRow) {
    const columnMap = {};
    Object.keys(firstRow).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('crop') || lowerKey.includes('commodity')) columnMap.crop = key;
        else if (lowerKey.includes('market') || lowerKey.includes('mandi') || lowerKey.includes('location')) columnMap.market = key;
        else if (lowerKey.includes('month') || lowerKey.includes('date')) columnMap.month = key;
        else if (lowerKey.includes('price') || lowerKey.includes('rate')) columnMap.price = key;
    });
    return columnMap;
}

function extractMonth(monthValue) {
    if (typeof monthValue === 'string') {
        if (monthValue.includes('-')) {
            const dateParts = monthValue.split('-');
            if (dateParts.length >= 2) {
                return parseInt(dateParts[1]) - 1;
            }
        } else if (monthValue.includes('/')) {
            const dateParts = monthValue.split('/');
            if (dateParts.length >= 2) {
                return parseInt(dateParts[1]) - 1;
            }
        } else {
            return parseInt(monthValue) - 1;
        }
    }
    return parseInt(monthValue) - 1;
}

function generateMarketInsights(marketData, months) {
    const insights = [];
    const prices = marketData.monthlyAverages.filter(p => p !== null);
    
    if (prices.length === 0) {
        marketData.insights = ['Insufficient data for analysis'];
        return;
    }

    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const maxMonth = marketData.monthlyAverages.indexOf(maxPrice);
    const minMonth = marketData.monthlyAverages.indexOf(minPrice);

    insights.push(`Busiest month: ${months[maxMonth]} (Highest prices)`);
    insights.push(`Quietest month: ${months[minMonth]} (Lowest prices)`);
    insights.push(`Total transactions: ${marketData.totalTransactions}`);
    insights.push(`Price range: ₹${marketData.priceRange.min.toFixed(2)} - ₹${marketData.priceRange.max.toFixed(2)}`);
    insights.push(`Number of crops traded: ${Object.keys(marketData.crops).length}`);

    marketData.insights = insights;
}

function getMarketStats(marketAnalysis) {
    const markets = Object.keys(marketAnalysis);
    let totalTransactions = 0;
    let totalCrops = 0;

    markets.forEach(market => {
        totalTransactions += marketAnalysis[market].totalTransactions;
        totalCrops += Object.keys(marketAnalysis[market].crops).length;
    });

    return {
        totalMarkets: markets.length,
        totalTransactions: totalTransactions,
        averageTransactions: Math.round(totalTransactions / markets.length),
        totalCropsTraded: totalCrops
    };
}

// Initialize server
loadCSVData().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📁 CSV Source: ${YOUR_CSV_FILE_PATH}`);
        console.log(`📊 Loaded ${cropData.length} records`);
        console.log(`🏪 Found ${allMarkets.size} markets`);
        console.log(`🌾 Found ${allCrops.size} crops`);
        console.log('✅ Market Analysis API is ready!');
        console.log('🌐 Access the application at: http://localhost:3000');
    });
}).catch(error => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
});