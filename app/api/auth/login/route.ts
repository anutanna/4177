// File: app/api/auth/login/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/db/prisma';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { serialize } from 'cookie';

// export async function POST(req: NextRequest) {
//   const { email, password } = await req.json();
//   if (!email || !password) {
//     return NextResponse.json(
//       { message: 'Email & password required' },
//       { status: 400 }
//   if (!user) {
//     return NextResponse.json(
//       { message: 'Invalid credentials' },
//       { status: 401 }
//     );
//   }

//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) {
//     return NextResponse.json(
//       { message: 'Invalid credentials' },
//       { status: 401 }
//     );
//   }

//   const accessToken = jwt.sign(
//     { userId: user.id },
//     process.env.ACCESS_TOKEN_SECRET!,
//     { expiresIn: '15m' }
//   );
//   const refreshToken = jwt.sign(
//     { userId: user.id },
//     process.env.REFRESH_TOKEN_SECRET!,
//     { expiresIn: '7d' }
//   );

//   const accessCookie = serialize('accessToken', accessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 15 * 60,
//     path: '/',
//   });
//   const refreshCookie = serialize('refreshToken', refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 7 * 24 * 60 * 60,
//     path: '/',
//   });

//   const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
//   response.headers.append('Set-Cookie', accessCookie);
//   response.headers.append('Set-Cookie', refreshCookie);
//   return response;
// }

