import { NextRequest, NextResponse } from 'next/server';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3/simple/price';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids') || '';
    const vs_currencies = searchParams.get('vs_currencies') || 'usd';
    const include_24hr_change = searchParams.get('include_24hr_change') || 'true';

    if (!ids) {
        return NextResponse.json({});
    }

    try {
        const url = `${COINGECKO_BASE}?ids=${ids}&vs_currencies=${vs_currencies}&include_24hr_change=${include_24hr_change}`;
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
            console.error(`CoinGecko API error: ${response.status}`);
            return NextResponse.json({});
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Failed to fetch prices from CoinGecko:', error);
        return NextResponse.json({});
    }
}
