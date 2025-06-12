-- Create tables for caching market data from IndianAPI

-- Table for trending stocks (gainers and losers)
CREATE TABLE IF NOT EXISTS cached_trending_stocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    price DECIMAL(10,2),
    percent_change DECIMAL(5,2),
    volume TEXT,
    overall_rating TEXT,
    stock_type TEXT NOT NULL CHECK (stock_type IN ('gainer', 'loser')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for most active stocks
CREATE TABLE IF NOT EXISTS cached_most_active_stocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company TEXT NOT NULL,
    price DECIMAL(10,2),
    percent_change DECIMAL(5,2),
    volume TEXT,
    overall_rating TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for market news
CREATE TABLE IF NOT EXISTS cached_market_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    url TEXT,
    image_url TEXT,
    source TEXT,
    pub_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for IPO data
CREATE TABLE IF NOT EXISTS cached_ipo_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    listing_date DATE,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    is_sme BOOLEAN DEFAULT FALSE,
    additional_text TEXT,
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for mutual funds
CREATE TABLE IF NOT EXISTS cached_mutual_funds (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fund_name TEXT NOT NULL,
    nav DECIMAL(10,4),
    change_percent DECIMAL(5,2),
    fund_type TEXT,
    rating TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for API usage logging
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint_type TEXT NOT NULL,
    success BOOLEAN DEFAULT TRUE,
    response_size INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trending_stocks_type ON cached_trending_stocks(stock_type);
CREATE INDEX IF NOT EXISTS idx_trending_stocks_created_at ON cached_trending_stocks(created_at);
CREATE INDEX IF NOT EXISTS idx_most_active_created_at ON cached_most_active_stocks(created_at);
CREATE INDEX IF NOT EXISTS idx_market_news_created_at ON cached_market_news(created_at);
CREATE INDEX IF NOT EXISTS idx_market_news_pub_date ON cached_market_news(pub_date);
CREATE INDEX IF NOT EXISTS idx_ipo_data_created_at ON cached_ipo_data(created_at);
CREATE INDEX IF NOT EXISTS idx_ipo_data_listing_date ON cached_ipo_data(listing_date);
CREATE INDEX IF NOT EXISTS idx_mutual_funds_created_at ON cached_mutual_funds(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint_type ON api_usage_logs(endpoint_type);
