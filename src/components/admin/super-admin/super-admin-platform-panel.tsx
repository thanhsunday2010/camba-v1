"use client";

import { CreditCard, Shield, SlidersHorizontal, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PLATFORM_MODULES = [
  {
    icon: Users,
    title: "Người dùng & vai trò",
    description: "Gán vai trò student, teacher, parent, admin cho tài khoản.",
    status: "Sắp ra mắt",
  },
  {
    icon: CreditCard,
    title: "Gói đăng ký & thanh toán",
    description: "Theo dõi đơn hàng SePay, gói Pro/VIP và whitelist AI.",
    status: "Sắp ra mắt",
  },
  {
    icon: SlidersHorizontal,
    title: "Cài đặt chương trình",
    description: "Chỉnh program_settings, XP, league và gamification.",
    status: "Sắp ra mắt",
  },
  {
    icon: Shield,
    title: "Bảo mật & audit",
    description: "Nhật ký thao tác admin và cấu hình quyền chi tiết.",
    status: "Sắp ra mắt",
  },
];

export function SuperAdminPlatformPanel() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Khu vực quản trị nền tảng dành cho Super Admin. Các module bên dưới sẽ được bổ sung trong các
        bản cập nhật tiếp theo.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {PLATFORM_MODULES.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.title} className="opacity-90">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                    <span className="text-xs font-medium text-amber-700">{module.status}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{module.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
