import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { userAddress } = await request.json();

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('scout-eth');
    const pollsCollection = db.collection('polls');

    // Fetch polls from MongoDB for the user
    const polls = await pollsCollection
      .find({ creator: userAddress })
      .sort({ createdAt: -1 })
      .toArray();

    if (!polls || polls.length === 0) {
      return NextResponse.json({
        success: true,
        polls: [],
        count: 0,
      });
    }

    const formattedPolls = polls.map((poll: any, index: number) => ({
      title: poll.title,
      option1: poll.option1,
      option2: poll.option2,
      latitude: Number(poll.latitude),
      longitude: Number(poll.longitude),
      pollTime: poll.pollTime,
      expiryTime: poll.expiryTime,
      creator: poll.creator,
      total_option1_stake: poll.total_option1_stake || 0,
      total_option2_stake: poll.total_option2_stake || 0,
      is_finalized: poll.is_finalized || false,
      winning_option: poll.winning_option || 0,
      index: poll.index ?? index,
    }));

    return NextResponse.json({
      success: true,
      polls: formattedPolls,
      count: formattedPolls.length,
    });
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
