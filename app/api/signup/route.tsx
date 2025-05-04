
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "../../models/User";
import { connect } from "../../lib/db";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const { name, email, password } = await req.json();

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      if (existingUser.lastSignupDate < oneMonthAgo) {
        // Обновить существующего пользователя
        existingUser.name = name;
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.lastSignupDate = new Date();
        await existingUser.save();
        return NextResponse.json(
          { message: "User updated successfully" },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Хеширование пароля и создание нового пользователя
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      lastSignupDate: new Date(),
    });
    await user.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}