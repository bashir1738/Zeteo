export const fetchStarkPrice = async (): Promise<number> => {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=starknet&vs_currencies=usd'
        );

        if (!response.ok) {
            throw new Error('Failed to fetch price');
        }

        const data = await response.json();
        return data.starknet.usd;
    } catch (error) {
        console.warn('Error fetching STRK price, using fallback:', error);
        return 0.40; // Fallback price
    }
};
