import { getUserByEmail, getUserById } from '@/utils/getUser';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const id = searchParams.get('id');

  if (!email && !id) {
    return NextResponse.json({ error: 'Email or ID is required' }, { status: 400 });
  }

  try {
    let user;

    if (email) {
      user = await getUserByEmail(email);
    } else if (id) {
      user = await getUserById(id);
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

