import { useState } from "react";
import { Search, Plus, Phone, Building2, Map, Users } from "lucide-react";
import { initialPeople } from "./data";
import PersonModal from "./components/PersonModal";
import Gallery, { compoundImages } from "./components/Gallery";

export default function App() {
  const [people, setPeople] = useState(initialPeople);
  const [search, setSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [streetFilter, setStreetFilter] = useState("");
  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit', person? }
  const [galleryIndex, setGalleryIndex] = useState(null);

  const buildingOptions = [...new Set(people.map((p) => p.building).filter((b) => b != null))].sort(
    (a, b) => a - b
  );
  const streetOptions = [...new Set(people.map((p) => p.street).filter((s) => s != null))].sort(
    (a, b) => a - b
  );

  const term = search.trim();
  const filteredPeople = people.filter((p) => {
    const matchesSearch = term
      ? p.name.includes(term) ||
        (p.mobile ?? "").includes(term) ||
        String(p.building ?? "").includes(term) ||
        String(p.street ?? "").includes(term)
      : true;
    const matchesBuilding = buildingFilter ? String(p.building) === buildingFilter : true;
    const matchesStreet = streetFilter ? String(p.street) === streetFilter : true;
    return matchesSearch && matchesBuilding && matchesStreet;
  });

  function handleSave(personData) {
    if (modal.mode === "add") {
      const nextId = people.length ? Math.max(...people.map((p) => p.id)) + 1 : 1;
      setPeople((prev) => [...prev, { ...personData, id: nextId }]);
    } else {
      setPeople((prev) =>
        prev.map((p) => (p.id === personData.id ? { ...p, ...personData } : p))
      );
    }
    setModal(null);
  }

  function handleDelete(id) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setModal(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <header className="sticky top-0 z-10 bg-teal-600 px-4 pb-4 pt-6 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-extrabold text-white">Sunset</h1>
        <div className="mb-4 flex items-center justify-center gap-2 rounded-2xl bg-sky-400 py-3.5 text-lg font-bold text-white shadow-sm">
          <Users size={22} />
          إجمالي عدد السكان: {people.length}
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400" size={22} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الرقم أو العمارة أو الشارع..."
            className="w-full rounded-2xl border-0 bg-white py-3.5 pr-12 pl-4 text-lg text-slate-800 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-200"
          />
        </div>
        <div className="mt-3 flex gap-3">
          <select
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            className="flex-1 rounded-2xl border-0 bg-white py-3 px-4 text-base font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            <option value="">الكل (العمارة)</option>
            {buildingOptions.map((b) => (
              <option key={b} value={b}>
                عمارة {b}
              </option>
            ))}
          </select>
          <select
            value={streetFilter}
            onChange={(e) => setStreetFilter(e.target.value)}
            className="flex-1 rounded-2xl border-0 bg-white py-3 px-4 text-base font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            <option value="">الكل (الشارع)</option>
            {streetOptions.map((s) => (
              <option key={s} value={s}>
                شارع {s}
              </option>
            ))}
          </select>
        </div>
      </header>

      <Gallery
        images={compoundImages}
        activeIndex={galleryIndex}
        onOpen={setGalleryIndex}
        onClose={() => setGalleryIndex(null)}
        onNavigate={setGalleryIndex}
      />

      <main className="mx-auto max-w-2xl px-4 pt-4">
        {filteredPeople.length === 0 ? (
          <p className="mt-16 text-center text-xl text-slate-400">لا توجد نتائج</p>
        ) : (
          <ul className="space-y-3">
            {filteredPeople.map((person) => (
              <li key={person.id}>
                <button
                  onClick={() => setModal({ mode: "edit", person })}
                  className="w-full rounded-2xl bg-white p-4 text-right shadow-sm transition active:scale-[0.98] active:bg-slate-50"
                >
                  <p className="text-xl font-bold text-slate-800">{person.name}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-slate-500">
                    {person.mobile && (
                      <span className="flex items-center gap-1.5" dir="ltr">
                        <Phone size={16} className="shrink-0" />
                        {person.mobile}
                      </span>
                    )}
                    {person.building != null && (
                      <span className="flex items-center gap-1.5">
                        <Building2 size={16} className="shrink-0" />
                        عمارة {person.building}
                      </span>
                    )}
                    {person.street != null && (
                      <span className="flex items-center gap-1.5">
                        <Map size={16} className="shrink-0" />
                        شارع {person.street}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <button
        onClick={() => setModal({ mode: "add" })}
        className="fixed bottom-6 end-6 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition hover:bg-teal-700 active:scale-95"
        aria-label="إضافة شخص جديد"
      >
        <Plus size={32} />
      </button>

      {modal && (
        <PersonModal
          mode={modal.mode}
          person={modal.person}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
