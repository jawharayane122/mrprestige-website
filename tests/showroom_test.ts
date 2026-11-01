import { assertEquals } from "jsr:@std/assert@1";
import "../showroom.js";

const S = (globalThis as any).Showroom;

Deno.test("titleCase: majuscules vers casse de titre, chiffres intacts", () => {
  assertEquals(S.titleCase("G CLASS"), "G Class");
  assertEquals(S.titleCase("COOPER  CAB"), "Cooper Cab");
  assertEquals(S.titleCase("911"), "911");
  assertEquals(S.titleCase("rolls-royce"), "Rolls-Royce");
});

Deno.test("normalize: marque et modèle viennent des champs, pas du découpage du libellé", () => {
  const v = S.normalize({ brand: "RANGE ROVER", model: "VOGUE", year: 2024, cat: "suv", price: 700, img: "x.jpg", label: "RANGE ROVER VOGUE" });
  assertEquals(v.brand, "Range Rover");
  assertEquals(v.model, "Vogue");
  assertEquals(v.name, "Range Rover Vogue");
});

Deno.test("normalize: sans champs séparés, le libellé reste entier dans le modèle", () => {
  const v = S.normalize({ label: "MERCEDES  G CLASS", price: "700", cat: "SUV" });
  assertEquals(v.brand, "");
  assertEquals(v.model, "Mercedes G Class");
  assertEquals(v.name, "Mercedes G Class");
  assertEquals(v.price, 700);
  assertEquals(v.cat, "suv");
});

Deno.test("categories: ordre fixe, seulement celles présentes", () => {
  const list = [{ cat: "van" }, { cat: "suv" }, { cat: "suv" }, { cat: "sportive" }].map(S.normalize);
  assertEquals(S.categories(list), ["suv", "sportive", "van"]);
});

Deno.test("formatPrice: espace insécable des milliers en français", () => {
  assertEquals(S.formatPrice(2500, "fr"), "2 500 €");
  assertEquals(S.formatPrice(0, "fr"), "");
});
