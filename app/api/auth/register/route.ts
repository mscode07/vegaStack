import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  console.log("Getting here ")
  try {
    const { username, firstName, lastName, email, password } = await req.json()

    if (!username || !firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await prisma.userTable.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.userTable.create({
      data: {
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
