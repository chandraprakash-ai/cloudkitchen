import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json(
                { error: "Server missing SUPABASE_SERVICE_ROLE_KEY environment variable. Add it to .env.local to enable admin management." },
                { status: 500 }
            );
        }

        // We use the service_role key to bypass RLS and use the admin api
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        // Get the authorization header sent by the client (the calling admin's token)
        const authHeader = request.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: callerData, error: callerError } = await supabaseAdmin.auth.getUser(token);

        if (callerError || !callerData.user) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        const isCallerAdmin = callerData.user.user_metadata?.role === "admin";
        if (!isCallerAdmin) {
            return NextResponse.json({ error: "Forbidden: Only admins can manage roles" }, { status: 403 });
        }

        // Search for the target user by email
        const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) {
            return NextResponse.json({ error: listError.message }, { status: 500 });
        }

        const targetUser = listData.users.find((u) => u.email === email);
        if (!targetUser) {
            return NextResponse.json({ error: "User not found. They must sign up first." }, { status: 404 });
        }

        if (targetUser.user_metadata?.role === "admin") {
            return NextResponse.json({ message: "User is already an admin" }, { status: 200 });
        }

        // Update their metadata
        const newMetadata = { ...targetUser.user_metadata, role: "admin" };
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
            user_metadata: newMetadata,
        });

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ message: `Successfully granted admin rights to ${email}` });
    } catch (err) {
        console.error("Admin assignment error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
