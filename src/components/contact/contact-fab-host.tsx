import { getContactChannels } from "@/lib/contact/contact-channels";
import { ContactFab } from "@/components/contact/contact-fab";

/** Server wrapper — reads contact env at render time and passes links to the client FAB. */
export function ContactFabHost() {
  const channels = getContactChannels();
  if (channels.length === 0) return null;
  return <ContactFab channels={channels} />;
}
