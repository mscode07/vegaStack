import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const like = await prisma.likeTable.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: params.id,
        },
      },
    })

    return NextResponse.json({ isLiked: !!like })
  } catch (err) {
    console.error("GET /like error:", err)
    return NextResponse.json({ error: "Failed to check like" }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.likeTable.create({
      data: {
        userId: session.user.id,
        postId: params.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("POST /like error:", err)
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.likeTable.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: params.id,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("DELETE /like error:", err)
    return NextResponse.json({ error: "Failed to unlike post" }, { status: 500 })
  }
}
