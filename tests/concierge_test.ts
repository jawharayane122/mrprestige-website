import { assert, assertEquals, assertMatch, assertNotMatch } from "jsr:@std/assert@1";
import "../concierge.js";

const C = (globalThis as any).Concierge;
const base = { service: "vehicle", model: "MERCEDES G CLASS & Co #1/é", start: "2026-11-05", end: "2026-11-10", guests: 3, note: "" };

Deno.test("url commence par le numéro WhatsApp", () => {
  assert(C.buildWhatsAppUrl(base, "fr").startsWith("https://wa.me/33651032530?text="));
});

Deno.test("modèle avec & # / é est encodé et restitué", () => {
  const text = decodeURIComponent(C.buildWhatsAppUrl(base, "fr").split("?text=")[1]);
  assert(text.includes("MERCEDES G CLASS & Co #1/é"));
  assertEquals(C.buildWhatsAppUrl(base, "fr").split("?text=")[1].includes("&"), false);
});

Deno.test("langue inconnue retombe sur fr", () => {
  assertEquals(C.buildWhatsAppUrl(base, "xx"), C.buildWhatsAppUrl(base, "fr"));
});

Deno.test("arabe contient caractères arabes et le modèle", () => {
  const text = decodeURIComponent(C.buildWhatsAppUrl(base, "ar").split("?text=")[1]);
  assertMatch(text, /[؀-ۿ]/);
  assert(text.includes("MERCEDES G CLASS"));
});

Deno.test("le texte ne promet pas de confirmation", () => {
  for (const l of ["fr", "en", "ar", "ru", "zh"]) {
    const text = decodeURIComponent(C.buildWhatsAppUrl(base, l).split("?text=")[1]);
    assertNotMatch(text, /confirm[ée]e?s?\b.*r[ée]servation|r[ée]servation confirm/i);
  }
});

const TODAY = "2026-11-01";
Deno.test("validateDates: ordre inversé", () => {
  assertEquals(C.validateDates("2026-11-10", "2026-11-05", TODAY), { ok: false, reason: "order" });
});
Deno.test("validateDates: manquantes", () => {
  assertEquals(C.validateDates("", "", TODAY), { ok: false, reason: "missing" });
});
Deno.test("validateDates: valides", () => {
  assertEquals(C.validateDates("2026-11-05", "2026-11-10", TODAY), { ok: true });
});
Deno.test("validateDates: début aujourd'hui accepté", () => {
  assertEquals(C.validateDates(TODAY, "2026-11-03", TODAY), { ok: true });
});
Deno.test("validateDates: début passé refusé", () => {
  assertEquals(C.validateDates("2024-01-01", "2024-01-05", TODAY), { ok: false, reason: "past" });
});
Deno.test("todayISO: date locale au format AAAA-MM-JJ", () => {
  assertEquals(C.todayISO(new Date(2026, 0, 9, 23, 30)), "2026-01-09");
});

Deno.test("matchVehicle retrouve le véhicule sans tenir compte de la casse", () => {
  assertEquals(C.matchVehicle(["Mercedes G Class", "Porsche 911"], " MERCEDES g class "), "Mercedes G Class");
  assertEquals(C.matchVehicle(["Porsche 911"], "Ferrari"), "");
  assertEquals(C.matchVehicle([], ""), "");
});

Deno.test("resolveModel prend le véhicule choisi, sinon le texte écrit", () => {
  assertEquals(C.resolveModel("Porsche 911", "ignoré"), "Porsche 911");
  assertEquals(C.resolveModel(C.OTHER_VEHICLE, "  une berline noire "), "une berline noire");
  assertEquals(C.resolveModel("", "texte"), "texte");
});
