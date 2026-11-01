import { assert } from "jsr:@std/assert@1";

const src = await Deno.readTextFile(new URL("../translations.js", import.meta.url));
const T = new Function(src + "; return T;")();

Deno.test("chaque langue couvre au moins 95 % des clés fr", () => {
  const fr = Object.keys(T.fr);
  for (const l of ["en", "ar", "ru", "zh"]) {
    const missing = fr.filter((k) => !(k in T[l]));
    assert(missing.length / fr.length <= 0.05, `${l}: ${missing.length} clés manquantes: ${missing.slice(0, 8).join(", ")}`);
  }
});

Deno.test("les clés cc_* existent dans les 5 langues", () => {
  for (const l of ["fr", "en", "ar", "ru", "zh"]) {
    for (const k of ["cc_title", "cc_send", "cc_disclaimer", "cc_err_order"]) assert(k in T[l], `${l}.${k}`);
  }
});

Deno.test("aucune langue ne promet un délai garanti de 15 minutes", () => {
  for (const l of ["fr", "en", "ar", "ru", "zh"]) {
    assert(!/15\s*(min|دقيقة|минут|分钟)/i.test(T[l].why3_desc + T[l].f_success), `${l} mentionne encore 15 minutes`);
  }
});

Deno.test("le badge véhicule n'affirme pas une disponibilité", () => {
  assert(T.fr.badge_avail === "Sur demande");
});
