import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserById, updateUser, deleteUser } from "@/lib/users"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await createUser(email, password)
    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const user = await getUserById(userId)
    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...userData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const user = await updateUser(id, userData)
    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await deleteUser(userId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
