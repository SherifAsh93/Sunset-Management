import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";

export default function PersonModal({ mode, person, onClose, onSave, onDelete }) {
  const [name, setName] = useState(person?.name ?? "");
  const [mobile, setMobile] = useState(person?.mobile ?? "");
  const [building, setBuilding] = useState(person?.building?.toString() ?? "");
  const [street, setStreet] = useState(person?.street?.toString() ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    () => window.visualViewport?.height ?? window.innerHeight
  );

  useEffect(() => {
    setName(person?.name ?? "");
    setMobile(person?.mobile ?? "");
    setBuilding(person?.building?.toString() ?? "");
    setStreet(person?.street?.toString() ?? "");
  }, [person]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    function handleResize() {
      setViewportHeight(vv.height);
    }
    vv.addEventListener("resize", handleResize);
    handleResize();
    return () => vv.removeEventListener("resize", handleResize);
  }, []);

  const isValid = name.trim() !== "";

  function handleFocusScroll(e) {
    const el = e.target;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }

  function handleSave() {
    if (!isValid) return;
    onSave({
      id: person?.id,
      name: name.trim(),
      mobile: mobile.trim(),
      building: building.trim() === "" ? undefined : Number(building),
      street: street.trim() === "" ? undefined : Number(street),
    });
  }

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      style={{ height: viewportHeight }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[85%] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {mode === "add" ? "إضافة شخص" : "تعديل البيانات"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="إغلاق"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-lg font-semibold text-slate-600">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={handleFocusScroll}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg text-slate-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="اكتب الاسم"
            />
          </div>

          <div>
            <label className="mb-1 block text-lg font-semibold text-slate-600">رقم الموبايل</label>
            <input
              type="tel"
              dir="ltr"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onFocus={handleFocusScroll}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg text-slate-800 text-right focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="01000000000"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-lg font-semibold text-slate-600">رقم العمارة</label>
              <input
                type="number"
                dir="ltr"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                onFocus={handleFocusScroll}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg text-slate-800 text-right focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="مثال: 7"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-lg font-semibold text-slate-600">الشارع</label>
              <input
                type="number"
                dir="ltr"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                onFocus={handleFocusScroll}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg text-slate-800 text-right focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="مثال: 133"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="w-full rounded-xl bg-orange-500 py-3 text-lg font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            حفظ
          </button>

          {mode === "edit" && (
            <>
              {!confirmingDelete ? (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-lg font-bold text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 size={20} />
                  حذف
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3">
                  <span className="flex-1 text-base font-semibold text-red-600">تأكيد الحذف؟</span>
                  <button
                    onClick={() => onDelete(person.id)}
                    className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                  >
                    نعم
                  </button>
                  <button
                    onClick={() => setConfirmingDelete(false)}
                    className="rounded-lg bg-white px-4 py-2 font-bold text-slate-600 hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
