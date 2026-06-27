import { connection } from "next/server";
import { getContactChannels } from "@/lib/contact/contact-channels";
import { ContactFab } from "@/components/contact/contact-fab";

/** Server wrapper — reads contact env at request time and passes links to the client FAB. */
export async function ContactFabHost() {
  await connection();
  const channels = getContactChannels();
  return <ContactFab initialChannels={channels} />;
}
