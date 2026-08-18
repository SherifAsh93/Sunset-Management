import { useEffect, useRef, useState } from "react";
import { Search, Plus, Phone, Building2, Map, Users, Lock, Unlock, X } from "lucide-react";
import { initialPeople } from "./data";
import PersonModal from "./components/PersonModal";
import Gallery, { compoundImages } from "./components/Gallery";

const PRIVACY_PASSWORD = "12311";
const NAME_MASK = "•••••• ••••••";
const MOBILE_MASK = "•••••••••••";

export default function App() {
  const [people, setPeople] = useState(initialPeople);
  const [search, setSearch] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [streetFilter, setStreetFilter] = useState("");
  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit', person? }
  const [galleryIndex, setGalleryIndex] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [toast, setToast] = useState(null);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const toastTimer = useRef(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    function handleViewportChange() {
      const inset = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardInset(Math.max(0, Math.round(inset)));
    }
    vv.addEventListener("resize", handleViewportChange);
    vv.addEventListener("scroll", handleViewportChange);
    handleViewportChange();
    return () => {
      vv.removeEventListener("resize", handleViewportChange);
      vv.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  function showToast(message) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2500);
  }

  function handleUnlockSubmit(e) {
    e.preventDefault();
    if (passwordInput === PRIVACY_PASSWORD) {
      setUnlocked(true);
      setShowPasswordField(false);
      setPasswordInput("");
    } else {
      showToast("كلمة المرور غير صحيحة");
      setPasswordInput("");
    }
  }

  function handleCardClick(person) {
    if (!unlocked) {
      showToast("أدخل كلمة المرور الصحيحة لتعديل البيانات");
      return;
    }
    setModal({ mode: "edit", person });
  }

  function handleAddClick() {
    if (!unlocked) {
      showToast("أدخل كلمة المرور الصحيحة لإضافة بيانات جديدة");
      return;
    }
    setModal({ mode: "add" });
  }

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

  function handleFocusScroll(e) {
    const el = e.target;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }

  return (
    <div
      className="min-h-dvh bg-slate-50"
      style={{ paddingBottom: `calc(7rem + ${keyboardInset}px)` }}
    >
      <header className="sticky top-0 z-10 bg-gradient-to-b from-blue-900 via-sky-700 to-sky-500 px-4 pb-6 pt-5 shadow-lg">
        <div className="relative mb-4 flex items-center justify-center">
          <a
            href="https://webistrydev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-y-0 end-0 flex items-center opacity-90 transition hover:opacity-100"
          >
            <img src="/webistrydev-logo.svg" alt="WebistryDev" className="h-7 w-7" />
          </a>
          <span
            className="text-xl italic tracking-wide text-amber-100"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Sunset
          </span>
        </div>

        <div className="mb-4 flex justify-center">
          {unlocked ? (
            <div className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-bold text-white shadow-sm">
              <Unlock size={16} />
              البيانات ظاهرة
            </div>
          ) : showPasswordField ? (
            <form onSubmit={handleUnlockSubmit} className="flex items-center gap-2">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onFocus={handleFocusScroll}
                placeholder="كلمة المرور"
                autoFocus
                className="w-36 rounded-full border-0 bg-white py-1.5 px-4 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-200"
              />
              <button
                type="submit"
                className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                دخول
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordField(false);
                  setPasswordInput("");
                }}
                className="rounded-full p-1.5 text-white/80 transition hover:text-white"
                aria-label="إلغاء"
              >
                <X size={16} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowPasswordField(true)}
              className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-white/25"
            >
              <Lock size={16} />
              البيانات مخفية - إدخال كلمة المرور
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 rounded-3xl bg-gradient-to-l from-sky-400 to-cyan-300 py-4 text-lg font-bold text-white shadow-lg shadow-sky-950/30">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25">
            <Users size={20} />
          </span>
          إجمالي عدد السكان: {people.length}
        </div>
      </header>

      <Gallery
        images={compoundImages}
        activeIndex={galleryIndex}
        onOpen={setGalleryIndex}
        onClose={() => setGalleryIndex(null)}
        onNavigate={setGalleryIndex}
      />

      <div className="relative z-20 mx-auto mt-2 max-w-2xl px-4">
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-900/10">
          <div className="relative">
            <Search className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400" size={22} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={handleFocusScroll}
              placeholder="بحث بالاسم أو الرقم أو العمارة أو الشارع..."
              className="w-full rounded-2xl border-0 bg-slate-50 py-3.5 pr-12 pl-4 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-200"
            />
          </div>
          <div className="mt-3 flex gap-3">
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="flex-1 rounded-2xl border-0 bg-slate-50 py-3 px-4 text-base font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-200"
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
              className="flex-1 rounded-2xl border-0 bg-slate-50 py-3 px-4 text-base font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-200"
            >
              <option value="">الكل (الشارع)</option>
              {streetOptions.map((s) => (
                <option key={s} value={s}>
                  شارع {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 pt-2">
        {filteredPeople.length === 0 ? (
          <p className="mt-16 text-center text-xl text-slate-400">لا توجد نتائج</p>
        ) : (
          <ul className="space-y-4">
            {filteredPeople.map((person) => (
              <li key={person.id}>
                <button
                  onClick={() => handleCardClick(person)}
                  className={`w-full rounded-3xl border border-slate-100 bg-white p-5 text-right shadow-sm transition ${
                    unlocked ? "active:scale-[0.98] active:bg-slate-50" : "cursor-not-allowed"
                  }`}
                >
                  <p
                    className={`text-2xl font-extrabold text-slate-800 ${
                      unlocked ? "" : "select-none blur-md"
                    }`}
                  >
                    {unlocked ? person.name : NAME_MASK}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-base text-slate-500">
                    {person.mobile && (
                      <span className="flex items-center gap-1.5" dir="ltr">
                        <Phone size={16} className="shrink-0" />
                        <span className={unlocked ? "" : "select-none blur-md"}>
                          {unlocked ? person.mobile : MOBILE_MASK}
                        </span>
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
        onClick={handleAddClick}
        className="fixed bottom-6 end-6 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-blue-800 text-white shadow-lg shadow-sky-950/30 transition hover:from-sky-500 hover:to-blue-700 active:scale-95"
        aria-label="إضافة شخص جديد"
      >
        <Plus size={32} />
      </button>

      {toast && (
        <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2 rounded-xl bg-red-500 px-5 py-3 text-center text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}

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
