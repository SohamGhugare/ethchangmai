import { NextRequest, NextResponse } from 'next/server';

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
    const { signedTransaction } = await request.json();

    // Validate input
    if (!signedTransaction) {
      return NextResponse.json(
        { error: 'Signed transaction is required' },
        { status: 400 }
      );
    }

    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const txHash = generateTxHash();

    return NextResponse.json({
      success: true,
      transactionHash: txHash,
      message: 'Poll created successfully on blockchain',
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
