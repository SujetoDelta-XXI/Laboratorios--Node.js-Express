import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, image } = await req.json();

    // Basic validation consistent with Prisma schema
    const trimmedEmail = typeof email === 'string' ? email.trim() : '';
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedImage = typeof image === 'string' ? image.trim() : '';
    const pw = typeof password === 'string' ? password : '';

    if (!trimmedEmail || !pw) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    if (pw.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(pw, 10);

    const created = await prisma.user.create({
      data: {
        name: trimmedName || null,
        email: trimmedEmail,
        password: hashedPassword,
        image: trimmedImage || null,
      },
    });

    // Do not return the password field
    const { password: _pw, ...safeUser } = created as any;
    return NextResponse.json({ user: safeUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
