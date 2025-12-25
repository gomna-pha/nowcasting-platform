import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Mock news headlines with sentiment
const newsHeadlines = [
  { text: "Fed signals potential rate cuts amid cooling inflation", sentiment: "positive" },
  { text: "Tech sector rallies on strong earnings reports", sentiment: "positive" },
  { text: "Market volatility increases amid geopolitical tensions", sentiment: "negative" },
  { text: "Central banks coordinate policy response", sentiment: "neutral" },
  { text: "Consumer confidence reaches 2-year high", sentiment: "positive" },
  { text: "Oil prices decline on oversupply concerns", sentiment: "negative" },
  { text: "Banks report robust lending activity", sentiment: "positive" },
  { text: "Trade negotiations show signs of progress", sentiment: "positive" },
  { text: "Manufacturing data disappoints expectations", sentiment: "negative" },
  { text: "Dollar strengthens against major currencies", sentiment: "neutral" },
  { text: "Employment numbers exceed analyst forecasts", sentiment: "positive" },
  { text: "Housing market shows signs of stabilization", sentiment: "neutral" },
  { text: "Retail sales data disappoints in key sectors", sentiment: "negative" },
  { text: "Corporate buyback activity reaches record levels", sentiment: "positive" },
  { text: "Inflation concerns persist despite rate hikes", sentiment: "negative" }
]

// Feature importance data
const features = [
  { name: "Recent Price Momentum", value: 0.24 },
  { name: "Sentiment Score", value: 0.19 },
  { name: "Volume Change", value: 0.15 },
  { name: "VIX Level", value: 0.13 },
  { name: "Put/Call Ratio", value: 0.11 },
  { name: "Yield Curve", value: 0.09 },
  { name: "Social Media Buzz", value: 0.09 }
]

// API Routes
app.get('/api/prediction', (c) => {
  const direction = Math.random() > 0.5 ? 'BULLISH' : 'BEARISH'
  const confidence = Math.random() * 30 + 60
  const finbertScore = Math.random() * 1.4 - 0.7
  const xgboostProb = Math.random() * 0.4 + 0.5
  const dnnProb = Math.random() * 0.4 + 0.5
  const accuracy = Math.random() * 10 + 63

  return c.json({
    direction,
    confidence: parseFloat(confidence.toFixed(1)),
    finbertScore: parseFloat(finbertScore.toFixed(2)),
    xgboostProb: parseFloat(xgboostProb.toFixed(2)),
    dnnProb: parseFloat(dnnProb.toFixed(2)),
    accuracy: parseFloat(accuracy.toFixed(1)),
    timestamp: new Date().toISOString()
  })
})

app.get('/api/dnn', (c) => {
  const layers = 4
  const totalNodes = 224
  const accuracy = (Math.random() * 3 + 64).toFixed(1)
  const latency = Math.floor(Math.random() * 5 + 13)
  const precision = (Math.random() * 3 + 62).toFixed(1)
  const recall = (Math.random() * 3 + 67).toFixed(1)

  return c.json({
    layers,
    totalNodes,
    accuracy,
    latency,
    precision,
    recall,
    timestamp: new Date().toISOString()
  })
})

app.get('/api/sentiment', (c) => {
  const shuffled = [...newsHeadlines].sort(() => Math.random() - 0.5).slice(0, 5)
  
  const sentimentData = shuffled.map(news => {
    let score: number
    if (news.sentiment === 'positive') {
      score = Math.random() * 0.3 + 0.7
    } else if (news.sentiment === 'negative') {
      score = Math.random() * 0.3 + 0.1
    } else {
      score = Math.random() * 0.2 + 0.4
    }
    
    return {
      text: news.text,
      sentiment: news.sentiment,
      score: parseFloat(score.toFixed(2))
    }
  })

  return c.json(sentimentData)
})

app.get('/api/features', (c) => {
  return c.json(features)
})

app.get('/api/history', (c) => {
  const horizons = ['1m', '5m', '15m', '30m', '1h', '2h', '4h', '8h', '1D', '2D', '1W', '2W', '1M']
  const predictions = []
  const actuals = []
  const timestamps = []
  
  // Generate time-series data with trend and noise
  let trend = 0
  const volatility = 0.3
  
  for (let i = 0; i < horizons.length; i++) {
    // Add some trend drift
    trend += (Math.random() - 0.5) * 0.2
    
    // Generate prediction with trend + noise
    const predValue = Math.tanh(trend + (Math.random() - 0.5) * volatility)
    predictions.push(predValue)
    
    // Actual follows prediction with some error (realistic accuracy ~67%)
    const error = (Math.random() - 0.5) * 0.4
    const actualValue = Math.random() > 0.33 ? predValue : -predValue + error
    actuals.push(Math.tanh(actualValue))
    
    timestamps.push(horizons[i])
  }
  
  return c.json({ 
    predictions, 
    actuals,
    horizons,
    timestamp: new Date().toISOString()
  })
})

app.get('/api/performance', (c) => {
  return c.json({
    categories: ['FinBERT', 'XGBoost', 'DNN', 'Ensemble'],
    accuracy: [64.2, 69.5, 65.8, 67.8],
    precision: [62.8, 71.2, 63.5, 69.1],
    recall: [67.5, 66.8, 69.2, 68.4]
  })
})

// Main route
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Financial Nowcasting Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #2d0a0a 0%, #721c24 50%, #1a0000 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .header {
            background: linear-gradient(135deg, #fffef7 0%, #f5e6d3 100%);
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 3px solid #b8860b;
        }
        
        .header h1 {
            color: #721c24;
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 700;
            text-shadow: 1px 1px 2px rgba(184, 134, 11, 0.3);
        }
        
        .header p {
            color: #5d4e37;
            font-size: 14px;
            font-weight: 500;
        }
        
        .timestamp {
            font-size: 11px;
            color: #8b7355;
            margin-top: 8px;
            font-style: italic;
        }
        
        .horizon-label {
            font-size: 10px;
            color: #8b7355;
            margin-top: 10px;
            text-align: center;
            font-weight: 600;
        }
        
        .horizon-separator {
            position: absolute;
            bottom: 50px;
            border-left: 2px dashed #b8860b;
            height: 250px;
            opacity: 0.4;
        }
        
        .status-bar {
            display: flex;
            gap: 15px;
            margin-top: 15px;
            flex-wrap: wrap;
        }
        
        .status-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 15px;
            background: #f7fafc;
            border-radius: 8px;
            font-size: 13px;
        }
        
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .status-dot.active {
            background: #721c24;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .card {
            background: linear-gradient(135deg, #fffef7 0%, #faf8f3 100%);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 2px solid #daa520;
        }
        
        .card h3 {
            color: #721c24;
            margin-bottom: 15px;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 700;
        }
        
        .prediction-box {
            background: linear-gradient(135deg, #721c24 0%, #8b2332 50%, #721c24 100%);
            color: #fff9e6;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 15px;
            border: 2px solid #b8860b;
        }
        
        .prediction-value {
            font-size: 48px;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .prediction-label {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .confidence-bar {
            background: rgba(0, 0, 0, 0.1);
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 10px;
        }
        
        .confidence-fill {
            height: 100%;
            background: white;
            border-radius: 4px;
            transition: width 0.5s ease;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        
        .metric {
            background: #f7fafc;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
        }
        
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #2d3748;
        }
        
        .metric-label {
            font-size: 12px;
            color: #718096;
            margin-top: 5px;
        }
        
        .sentiment-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: #f7fafc;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        
        .sentiment-text {
            font-size: 13px;
            color: #2d3748;
            flex: 1;
            margin-right: 10px;
        }
        
        .sentiment-score {
            font-weight: bold;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 12px;
        }
        
        .sentiment-score.positive {
            background: #c6f6d5;
            color: #22543d;
        }
        
        .sentiment-score.negative {
            background: #fed7d7;
            color: #742a2a;
        }
        
        .sentiment-score.neutral {
            background: #e2e8f0;
            color: #2d3748;
        }
        
        .feature-list {
            list-style: none;
        }
        
        .feature-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .feature-name {
            color: #4a5568;
            font-size: 13px;
        }
        
        .feature-value {
            color: #2d3748;
            font-weight: 600;
            font-size: 13px;
        }
        
        .chart-container {
            height: 300px;
            margin-top: 15px;
            background: #f7fafc;
            border-radius: 8px;
            padding: 15px;
        }
        
        button {
            background: linear-gradient(135deg, #b8860b 0%, #daa520 100%);
            color: #1a0000;
            border: 2px solid #8b6914;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
            transition: transform 0.2s, background 0.2s;
            width: 100%;
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        button:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #daa520 0%, #f4d03f 100%);
            box-shadow: 0 4px 12px rgba(184, 134, 11, 0.4);
        }
        
        .model-badge {
            display: inline-block;
            padding: 4px 10px;
            background: linear-gradient(135deg, #b8860b 0%, #daa520 100%);
            border-radius: 6px;
            font-size: 11px;
            color: #1a0000;
            margin-left: auto;
            font-weight: 700;
            border: 1px solid #8b6914;
        }

        canvas {
            max-width: 100%;
            height: auto;
        }

        .chart-legend {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 10px;
            font-size: 12px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .legend-color {
            width: 15px;
            height: 15px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Real-Time Financial Nowcasting Platform</h1>
            <p>Multi-Model Ensemble: FinBERT Sentiment + XGBoost + Deep Neural Network</p>
            
            <div class="status-bar">
                <div class="status-item">
                    <div class="status-dot active"></div>
                    <span>Live Data Feed</span>
                </div>
                <div class="status-item">
                    <div class="status-dot active"></div>
                    <span>FinBERT Active</span>
                </div>
                <div class="status-item">
                    <div class="status-dot active"></div>
                    <span>XGBoost Running</span>
                </div>
                <div class="status-item">
                    <div class="status-dot active"></div>
                    <span>DNN Inference</span>
                </div>
                <div class="status-item">
                    <span>Latency: <strong>47ms</strong></span>
                </div>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>
                    Market Direction Forecast
                    <span class="model-badge">Ensemble</span>
                </h3>
                <div class="prediction-box">
                    <div class="prediction-label">Next Hour Direction</div>
                    <div class="prediction-value" id="direction">BULLISH</div>
                    <div class="prediction-label">Confidence: <span id="confidence">78.3%</span></div>
                    <div class="confidence-bar">
                        <div class="confidence-fill" id="confidenceBar" style="width: 78.3%"></div>
                    </div>
                </div>
                
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-value" id="finbertScore">+0.64</div>
                        <div class="metric-label">FinBERT Score</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value" id="xgboostProb">0.82</div>
                        <div class="metric-label">XGBoost Prob</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value" id="dnnProb">0.71</div>
                        <div class="metric-label">DNN Prob</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value" id="accuracy">67.8%</div>
                        <div class="metric-label">Directional Acc.</div>
                    </div>
                </div>
                <div class="timestamp" id="predictionTimestamp"></div>
            </div>
            
            <div class="card">
                <h3>
                    FinBERT Sentiment Analysis
                    <span class="model-badge">NLP</span>
                </h3>
                <div id="sentimentFeed"></div>
                <div class="timestamp" id="sentimentTimestamp"></div>
                <button onclick="refreshSentiment()">Refresh News Feed</button>
            </div>
            
            <div class="card">
                <h3>
                    Feature Importance
                    <span class="model-badge">XGBoost</span>
                </h3>
                <ul class="feature-list" id="featureList"></ul>
                <div class="timestamp" id="featureTimestamp"></div>
            </div>
            
            <div class="card">
                <h3>
                    Deep Neural Network
                    <span class="model-badge">DNN</span>
                </h3>
                <div class="metrics-grid">
                    <div class="metric">
                        <div class="metric-value" id="dnnLayers">-</div>
                        <div class="metric-label">Network Layers</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value" id="dnnNodes">-</div>
                        <div class="metric-label">Total Nodes</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value" id="dnnAccuracy">-</div>
                        <div class="metric-label">Accuracy</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value" id="dnnLatency">-</div>
                        <div class="metric-label">Latency</div>
                    </div>
                </div>
                <div class="timestamp" id="dnnTimestamp"></div>
            </div>
        </div>
        
        <div class="card">
            <h3>Real-Time Prediction History</h3>
            <div class="chart-container">
                <canvas id="predictionChart"></canvas>
            </div>
            <div class="chart-legend">
                <div class="legend-item">
                    <div class="legend-color" style="background: #721c24;"></div>
                    <span>Predicted</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #b8860b;"></div>
                    <span>Actual</span>
                </div>
            </div>
            <div class="timestamp" id="historyTimestamp"></div>
        </div>
        
        <div class="card">
            <h3>Model Performance Metrics</h3>
            <div class="chart-container">
                <canvas id="performanceChart"></canvas>
            </div>
            <div class="timestamp" id="performanceTimestamp"></div>
        </div>
    </div>

    <script>
        // Format timestamp
        function formatTimestamp(date) {
            return 'Last updated: ' + date.toLocaleTimeString() + ' on ' + date.toLocaleDateString();
        }
        
        // Fetch sentiment data from API
        async function refreshSentiment() {
            try {
                const response = await fetch('/api/sentiment');
                const data = await response.json();
                
                const sentimentFeed = document.getElementById('sentimentFeed');
                sentimentFeed.innerHTML = '';
                
                data.forEach(news => {
                    const item = document.createElement('div');
                    item.className = 'sentiment-item';
                    item.innerHTML = \`
                        <div class="sentiment-text">\${news.text}</div>
                        <div class="sentiment-score \${news.sentiment}">\${news.score}</div>
                    \`;
                    sentimentFeed.appendChild(item);
                });
                
                document.getElementById('sentimentTimestamp').textContent = formatTimestamp(new Date());
            } catch (error) {
                console.error('Error fetching sentiment:', error);
            }
        }
        
        // Fetch and display feature importance
        async function displayFeatures() {
            try {
                const response = await fetch('/api/features');
                const features = await response.json();
                
                const featureList = document.getElementById('featureList');
                features.forEach(feature => {
                    const item = document.createElement('li');
                    item.className = 'feature-item';
                    item.innerHTML = \`
                        <span class="feature-name">\${feature.name}</span>
                        <span class="feature-value">\${(feature.value * 100).toFixed(1)}%</span>
                    \`;
                    featureList.appendChild(item);
                });
                
                document.getElementById('featureTimestamp').textContent = formatTimestamp(new Date());
            } catch (error) {
                console.error('Error fetching features:', error);
            }
        }
        
        // Simple chart drawing function
        function drawLineChart(canvasId, data1, data2, horizons) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            const width = canvas.parentElement.offsetWidth - 30;
            const height = 250;
            canvas.width = width;
            canvas.height = height;
            
            const padding = 40;
            const chartWidth = width - padding * 2;
            const chartHeight = height - padding * 2;
            
            // Use horizons from API or default
            const timeHorizons = horizons || ['1m', '5m', '15m', '30m', '1h', '2h', '4h', '8h', '1D', '2D', '1W', '2W', '1M'];
            
            // Microstructure vs Macrodynamics boundaries
            const microEnd = 6; // Up to 4h is microstructure
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Draw background zones
            // Microstructure zone (wine tint)
            ctx.fillStyle = 'rgba(114, 28, 36, 0.05)';
            ctx.fillRect(padding, padding, (microEnd / timeHorizons.length) * chartWidth, chartHeight);
            
            // Macrodynamics zone (gold tint)
            ctx.fillStyle = 'rgba(184, 134, 11, 0.05)';
            ctx.fillRect(padding + (microEnd / timeHorizons.length) * chartWidth, padding, 
                        ((timeHorizons.length - microEnd) / timeHorizons.length) * chartWidth, chartHeight);
            
            // Draw zone separator
            ctx.strokeStyle = '#b8860b';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            const separatorX = padding + (microEnd / timeHorizons.length) * chartWidth;
            ctx.moveTo(separatorX, padding);
            ctx.lineTo(separatorX, height - padding);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw zone labels
            ctx.fillStyle = '#721c24';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('MICROSTRUCTURE', padding + ((microEnd / 2) / timeHorizons.length) * chartWidth, padding - 10);
            
            ctx.fillStyle = '#b8860b';
            ctx.fillText('MACRODYNAMICS', 
                        padding + ((microEnd + (timeHorizons.length - microEnd) / 2) / timeHorizons.length) * chartWidth, 
                        padding - 10);
            
            // Draw axes
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.lineTo(padding, height - padding);
            ctx.lineTo(width - padding, height - padding);
            ctx.stroke();
            
            // Draw X-axis labels (time horizons)
            ctx.fillStyle = '#5d4e37';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            timeHorizons.forEach((label, i) => {
                const x = padding + (i / (timeHorizons.length - 1)) * chartWidth;
                ctx.fillText(label, x, height - padding + 15);
            });
            
            // Draw data
            const stepX = chartWidth / (data1.length - 1);
            
            // Predicted line
            ctx.strokeStyle = '#721c24';
            ctx.lineWidth = 3;
            ctx.beginPath();
            data1.forEach((val, i) => {
                const x = padding + i * stepX;
                const y = height - padding - ((val + 1) / 2) * chartHeight;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            
            // Actual line
            ctx.strokeStyle = '#b8860b';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            data2.forEach((val, i) => {
                const x = padding + i * stepX;
                const y = height - padding - ((val + 1) / 2) * chartHeight;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Labels
            ctx.fillStyle = '#718096';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('Up', 10, padding);
            ctx.fillText('Down', 10, height - padding);
        }
        
        function drawBarChart(canvasId, categories, datasets) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            const width = canvas.parentElement.offsetWidth - 30;
            const height = 250;
            canvas.width = width;
            canvas.height = height;
            
            const padding = 40;
            const chartWidth = width - padding * 2;
            const chartHeight = height - padding * 2;
            
            ctx.clearRect(0, 0, width, height);
            
            // Draw axes
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding, padding);
            ctx.moveTo(padding, height - padding);
            ctx.lineTo(width - padding, height - padding);
            ctx.stroke();
            
            const barWidth = chartWidth / (categories.length * datasets.length + categories.length);
            const colors = ['#721c24', '#b8860b', '#8b2332'];
            
            categories.forEach((cat, i) => {
                datasets.forEach((data, j) => {
                    const x = padding + (i * (datasets.length + 1) + j) * barWidth + barWidth/2;
                    const barHeight = (data[i] / 100) * chartHeight;
                    const y = height - padding - barHeight;
                    
                    ctx.fillStyle = colors[j];
                    ctx.fillRect(x, y, barWidth * 0.8, barHeight);
                });
                
                // Category labels
                ctx.fillStyle = '#718096';
                ctx.font = '11px sans-serif';
                ctx.textAlign = 'center';
                const labelX = padding + (i * (datasets.length + 1) + 1) * barWidth;
                ctx.fillText(cat, labelX, height - padding + 20);
            });
        }
        
        // Initialize prediction chart
        async function initPredictionChart() {
            try {
                const response = await fetch('/api/history');
                const data = await response.json();
                drawLineChart('predictionChart', data.predictions, data.actuals, data.horizons);
                document.getElementById('historyTimestamp').textContent = formatTimestamp(new Date());
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        }
        
        // Initialize performance chart
        async function initPerformanceChart() {
            try {
                const response = await fetch('/api/performance');
                const data = await response.json();
                drawBarChart('performanceChart', data.categories, [data.accuracy, data.precision, data.recall]);
                document.getElementById('performanceTimestamp').textContent = formatTimestamp(new Date());
            } catch (error) {
                console.error('Error fetching performance:', error);
            }
        }
        
        // Update predictions periodically
        async function updatePrediction() {
            try {
                const response = await fetch('/api/prediction');
                const data = await response.json();
                
                document.getElementById('direction').textContent = data.direction;
                document.getElementById('confidence').textContent = data.confidence + '%';
                document.getElementById('confidenceBar').style.width = data.confidence + '%';
                
                const finbertDisplay = data.finbertScore >= 0 ? '+' + data.finbertScore : data.finbertScore;
                document.getElementById('finbertScore').textContent = finbertDisplay;
                document.getElementById('xgboostProb').textContent = data.xgboostProb;
                document.getElementById('dnnProb').textContent = data.dnnProb;
                document.getElementById('accuracy').textContent = data.accuracy + '%';
                
                document.getElementById('predictionTimestamp').textContent = formatTimestamp(new Date());
            } catch (error) {
                console.error('Error updating prediction:', error);
            }
        }
        
        // Update DNN metrics
        async function updateDNNMetrics() {
            try {
                const response = await fetch('/api/dnn');
                const data = await response.json();
                
                document.getElementById('dnnLayers').textContent = data.layers;
                document.getElementById('dnnNodes').textContent = data.totalNodes;
                document.getElementById('dnnAccuracy').textContent = data.accuracy + '%';
                document.getElementById('dnnLatency').textContent = data.latency + 'ms';
                document.getElementById('dnnTimestamp').textContent = formatTimestamp(new Date());
            } catch (error) {
                console.error('Error fetching DNN metrics:', error);
            }
        }
        
        // Initialize everything when page loads
        window.addEventListener('load', function() {
            refreshSentiment();
            displayFeatures();
            initPredictionChart();
            initPerformanceChart();
            updateDNNMetrics();
            
            // Update every 5 seconds
            setInterval(updatePrediction, 5000);
            setInterval(refreshSentiment, 10000);
            setInterval(updateDNNMetrics, 8000);
            setInterval(initPredictionChart, 15000); // Update history chart every 15 seconds
        });
        
        // Redraw charts on resize
        window.addEventListener('resize', function() {
            initPredictionChart();
            initPerformanceChart();
        });
    </script>
</body>
</html>`)
})

export default app
