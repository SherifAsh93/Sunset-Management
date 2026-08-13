import { useState } from "react";
import { Search, Plus, Phone, MapPin } from "lucide-react";
import { initialPeople } from "./data";
import PersonModal from "./components/PersonModal";

export default function App() {
  const [people, setPeople] = useState(initialPeople);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit', person? }

  const term = search.trim();
  const filteredPeople = term
    ? people.filter(
        (p) =>
          p.name.includes(term) || p.mobile.includes(term) || p.direction.includes(term)
      )
    : people;

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
      <header className="sticky top-0 z-10 bg-orange-500 px-4 pb-4 pt-6 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-extrabold text-white">دليل الأرقام</h1>
        <div className="relative">
          <Search className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400" size={22} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الرقم أو الجهة..."
            className="w-full rounded-2xl border-0 bg-white py-3.5 pr-12 pl-4 text-lg text-slate-800 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-200"
          />
        </div>
      </header>

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
                    <span className="flex items-center gap-1.5" dir="ltr">
                      <Phone size={16} className="shrink-0" />
                      {person.mobile}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} className="shrink-0" />
                      {person.direction}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <button
        onClick={() => setModal({ mode: "add" })}
        className="fixed bottom-6 end-6 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600 active:scale-95"
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
