import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// Production: import prisma from '@/lib/prisma';

// Demo user store
const registeredUsers = [];

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Check duplicates
    const existing = registeredUsers.find(u => u.email === email || u.username === username);
    if (existing) {
      return NextResponse.json(
        { error: existing.email === email ? 'Email already registered' : 'Username taken' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = {
      id: `user_${Date.now()}`,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      playBalance: 10000,
      createdAt: new Date().toISOString(),
    };

    registeredUsers.push(user);

    /* Production code:
    const user = await prisma.user.create({
      data: { username, email: email.toLowerCase(), password: hashedPassword, playBalance: 10000 },
      select: { id: true, username: true, email: true, playBalance: true, createdAt: true },
    });
    */

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, playBalance: user.playBalance },
      message: 'Account created! You received $10,000 in play money.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
