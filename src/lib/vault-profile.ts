import type { Member, Property, Settings } from "./demo-data";
import { me } from "./demo-data";
import type { TrustState } from "./trust";

/** A short plain-text description of the agency, sent so each document is written for it. */
export function buildAgencyProfile(s: {
  settings: Settings;
  members: Member[];
  properties: Property[];
  trust: TrustState;
}): string {
  const a = s.settings.agency;
  const sales = s.properties.filter((p) => p.type === "sale").length;
  const managed = s.properties.filter((p) => p.type !== "sale").length;
  const suburbs = [...new Set(s.properties.map((p) => p.suburb))].slice(0, 8);
  return [
    `Agency name: ${a.name}`,
    `Legal entity: ${a.trading}`,
    `NSW real estate agency licence number: ${a.licenceNo}`,
    `ABN: ${a.abn}`,
    `Address: ${a.address}`,
    `Phone: ${a.phone}`,
    `Licensee in charge: ${me.name} (${me.role})`,
    `Software plan: ${s.settings.plan}`,
    "Team:",
    ...s.members.map(
      (m) => `- ${m.name}, ${m.team}, access level ${m.access} (${m.status})`,
    ),
    `Activity: ${sales} properties currently listed for sale, ${managed} under property management.`,
    suburbs.length ? `Suburbs worked: ${suburbs.join(", ")}.` : "",
    `Trust accounts: ${s.trust.accounts.map((t) => t.name).join("; ") || "none recorded"}.`,
  ]
    .filter(Boolean)
    .join("\n");
}
