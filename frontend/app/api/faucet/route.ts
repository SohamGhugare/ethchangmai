import { NextRequest, NextResponse } from 'next/server';

// Rate limiting: track requests per address
const requestTimestamps = new Map<string, number>();
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const FAUCET_AMOUNT = 0.5; // 0.5 ETH

// Generate a random transaction hash
function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export async function POST(request: NextRequest) {
  try {
    const { recipientAddress } = await request.json();

    if (!recipientAddress) {
      return NextResponse.json(
        { error: 'Recipient address is required' },
        { status: 400 }
      );
    }

    // Rate limiting check
    const now = Date.now();
    const lastRequest = requestTimestamps.get(recipientAddress);

    if (lastRequest && (now - lastRequest) < RATE_LIMIT_WINDOW) {
      const timeRemaining = RATE_LIMIT_WINDOW - (now - lastRequest);
      const hoursRemaining = Math.ceil(timeRemaining / (60 * 60 * 1000));

      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please try again in ${hoursRemaining} hours.`,
          canRequestAgainAt: new Date(lastRequest + RATE_LIMIT_WINDOW).toISOString()
        },
        { status: 429 }
      );
    }

    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const txHash = generateTxHash();

    // Update rate limiting timestamp
    requestTimestamps.set(recipientAddress, now);

    return NextResponse.json({
      success: true,
      message: `Successfully sent ${FAUCET_AMOUNT} ETH to ${recipientAddress}`,
      transactionHash: txHash,
      amount: FAUCET_AMOUNT,
      amountInETH: FAUCET_AMOUNT.toFixed(2),
      explorerUrl: `https://sepolia.etherscan.io/tx/${txHash}`,
    });
  } catch (error) {
    console.error('Faucet error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process faucet request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
