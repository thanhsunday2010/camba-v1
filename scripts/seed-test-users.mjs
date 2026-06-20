import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const TEST_PASSWORD = "camba123";

const TEST_USERS = [
  {
    email: "student@camba.me",
    fullName: "Học sinh Test",
    roles: ["student"],
  },
  {
    email: "parent@camba.me",
    fullName: "Phụ huynh Test",
    roles: ["parent"],
  },
  {
    email: "teacher@camba.me",
    fullName: "Giáo viên Test",
    roles: ["teacher"],
  },
  {
    email: "admin@camba.me",
    fullName: "Admin Test",
    roles: ["admin"],
  },
];

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value || value.startsWith("your-") || value.includes("your-project")) {
    throw new Error(
      `Thiếu hoặc chưa cấu hình ${name}. Cập nhật .env.local với thông tin Supabase thật trước khi chạy script.`
    );
  }
  return value;
}

async function ensureRole(supabase, userId, role) {
  const { data: existing, error: selectError } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", role)
    .maybeSingle();

  if (selectError) {
    throw new Error(`Không thể kiểm tra role ${role}: ${selectError.message}`);
  }

  if (existing) return;

  const { error: insertError } = await supabase
    .from("user_roles")
    .insert({ user_id: userId, role });

  if (insertError) {
    throw new Error(`Không thể gán role ${role}: ${insertError.message}`);
  }
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log("Đang tạo tài khoản test CAMBA...\n");

  for (const account of TEST_USERS) {
    const { data: listed, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Không thể truy vấn users: ${listError.message}`);
    }

    const existing = listed.users.find((user) => user.email === account.email);

    let userId = existing?.id;

    if (!userId) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: account.email,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: account.fullName },
      });

      if (error) {
        throw new Error(`Không thể tạo ${account.email}: ${error.message}`);
      }

      userId = data.user.id;
      console.log(`✓ Đã tạo: ${account.email}`);
    } else {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: account.fullName },
      });

      if (error) {
        throw new Error(`Không thể cập nhật ${account.email}: ${error.message}`);
      }

      console.log(`✓ Đã cập nhật: ${account.email}`);
    }

    for (const role of account.roles) {
      await ensureRole(supabase, userId, role);
    }
  }

  console.log("\nTài khoản test sẵn sàng:");
  console.log("────────────────────────────────────────");
  for (const account of TEST_USERS) {
    console.log(`${account.roles[0].padEnd(8)} | ${account.email} | ${TEST_PASSWORD}`);
  }
  console.log("────────────────────────────────────────");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
  console.log(`\nĐăng nhập tại: ${appUrl.replace(/\/$/, "")}/vi/login`);
}

main().catch((error) => {
  console.error(`\nLỗi: ${error.message}`);
  process.exit(1);
});
