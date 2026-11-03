export interface EntourageMember {
  name: string;
  label?: string;
}

export interface EntourageGroup {
  id: string;
  title: string;
  members: EntourageMember[];
  paired?: boolean;
}

export interface EntourageRow {
  id: string;
  title?: string;
  layout: "couple" | "two" | "three" | "flowers";
  groups: EntourageGroup[];
}

// Names and titles confirmed by the couple. Repeat a person under each role
// they hold; groomsmen and bridesmaids are independent, unpaired lists.
export const entourage: EntourageRow[] = [
  { id: "couple", layout: "couple", groups: [
    { id: "bride-and-groom", title: "Bride & Groom", members: [
      { name: "Romalyn P. Mauricio", label: "Bride" },
      { name: "Deo R. Martinez", label: "Groom" }
    ] }
  ] },
  { id: "parents", layout: "two", groups: [
    { id: "bride-parents", title: "Parents of the Bride", members: [
      { name: "Imelda P. Mauricio", label: "Mother" },
      { name: "Nestor P. Mauricio", label: "Father" }
    ] },
    { id: "groom-parents", title: "Parents of the Groom", members: [
      { name: "Cresencia C. Martinez", label: "Mother" },
      { name: "Diomedes B. Martinez", label: "Father" }
    ] }
  ] },
  { id: "principal-sponsors", title: "Principal Sponsors", layout: "two", groups: [
    { id: "ninong", title: "Ninong", members: [
      { name: "Francico Gabriel" }, { name: "Michael Fausino" },
      { name: "Emilio Pacheco" }, { name: "Cristito Garbin" },
      { name: "Allan Mejia" }, { name: "Victorino Pader" },
      { name: "Eric Julian" }, { name: "Adriano Catalan" },
      { name: "Fernando Mangalindan" }, { name: "Teodoro Pagaduan" },
      { name: "Rady Encarnacion" }, { name: "Joven Calunsag" },
      { name: "Gil Ventura" }, { name: "Ver Valdez" }
    ] },
    { id: "ninang", title: "Ninang", members: [
      { name: "Rosallie Gabriel" }, { name: "Maria Rosario Faustino" },
      { name: "Baby Esmas" }, { name: "Josie Tolentino" },
      { name: "Lina Nonato" }, { name: "Marieta Mallari" },
      { name: "Pinky Guilermo" }, { name: "Eunice Catalan" },
      { name: "Angie Lozano" }, { name: "Ofelia Ongan" },
      { name: "Ofelia Liwanag" }, { name: "Rosalie Calunsag" },
      { name: "Maria Luisa Barawid" }, { name: "Marivic Reyes" }
    ] }
  ] },
  { id: "honor-attendants", layout: "two", groups: [
    { id: "best-man", title: "Best Man", members: [{ name: "John Michael Martinez" }] },
    { id: "maid-of-honor", title: "Maid of Honor", members: [{ name: "Rosemarie P. Mauricio" }] }
  ] },
  { id: "wedding-party", layout: "two", groups: [
    { id: "groomsmen", title: "Groomsmen", members: [
      { name: "Michael Santiago" }, { name: "Jan Harry Madrona" },
      { name: "Ace Jimuel Martinez" }, { name: "Rafael Paginag" },
      { name: "Stephen Kenji Pader" }, { name: "Kevin Genzola" },
      { name: "Rheyverl Kenth Naparan" }, { name: "John Cedrick Martinez" }
    ] },
    { id: "bridesmaids", title: "Bridesmaids", members: [
      { name: "Rosemarie Sabatin" }, { name: "Jhigie Magbalot" },
      { name: "Rhea Apostol" }, { name: "Alexis Tolentino" },
      { name: "Ronalyn Paginag" }, { name: "Melody Grace Pacheco" },
      { name: "Sheila Mae Pader" }, { name: "Thyrnne Miel Martinez" }
    ] }
  ] },
  { id: "sponsors", layout: "three", groups: [
    { id: "candle-sponsors", title: "Candle Sponsors", paired: true, members: [
      { name: "Rosemarie Sabatin" }, { name: "Michael Santiago" }
    ] },
    { id: "veil-sponsors", title: "Veil Sponsors", paired: true, members: [
      { name: "Jhigie Magbalot" }, { name: "Jan Harry Madrona" }
    ] },
    { id: "cord-sponsors", title: "Cord Sponsors", paired: true, members: [
      { name: "Melody Grace Pacheco" }, { name: "Kevin Genzola" }
    ] }
  ] },
  { id: "bearers", layout: "three", groups: [
    { id: "ring-bearer", title: "Ring Bearer", members: [{ name: "Azaiah M. Pellejera" }] },
    { id: "coin-bearer", title: "Coin Bearer", members: [{ name: "M Quizon" }] },
    { id: "bible-bearer", title: "Bible Bearer", members: [{ name: "Zymond Elizan" }] }
  ] },
  { id: "flower-girls", layout: "flowers", groups: [
    { id: "flower-girls-list", title: "Flower Girls", members: [
      { name: "Kheily Jayeanne Gabriel" }, { name: "Keisha Esmas" },
      { name: "Elisha Faye Mauricio" }, { name: "Liliane Esmira" },
      { name: "Shane Channel Naparan" }, { name: "Princess Fronda" },
      { name: "Garlene Mye Centro" }, { name: "Axcel Ea Tolentino" },
      { name: "Zeane Clarence Liwanag" }
    ] }
  ] }
];
