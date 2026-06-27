import { afterEach, describe, expect, it } from "vitest";
import { getContactChannels } from "@/lib/contact/contact-channels";

describe("getContactChannels", () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_CONTACT_ZALO;
    delete process.env.NEXT_PUBLIC_CONTACT_MESSENGER;
    delete process.env.CONTACT_ZALO;
    delete process.env.CONTACT_MESSENGER;
  });

  it("builds Zalo and Messenger links from env values", () => {
    process.env.NEXT_PUBLIC_CONTACT_ZALO = "+84912345678";
    process.env.NEXT_PUBLIC_CONTACT_MESSENGER = "camba.edu";

    expect(getContactChannels()).toEqual([
      { id: "zalo", href: "https://zalo.me/0912345678" },
      { id: "messenger", href: "https://m.me/camba.edu" },
    ]);
  });

  it("reads server-only env keys", () => {
    process.env.CONTACT_ZALO = "0912345678";
    process.env.CONTACT_MESSENGER = "m.me/camba.edu";

    expect(getContactChannels()).toEqual([
      { id: "zalo", href: "https://zalo.me/0912345678" },
      { id: "messenger", href: "https://m.me/camba.edu" },
    ]);
  });

  it("returns empty list when env is unset", () => {
    expect(getContactChannels()).toEqual([]);
  });
});
