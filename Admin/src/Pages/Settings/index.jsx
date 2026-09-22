import { useEffect, useState } from "react";
import apimethods from "../../Methods/ApiClient";

const emptyForm = { name: "", email: "", phone: "", address: "", location: "" };

const Settings = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    apimethods.getApi("/protected/profile")
      .then((response) => setForm({ ...emptyForm, ...(response?.data?.data || {}) }))
      .catch(() => setFeedback({ type: "error", message: "Unable to load admin details." }))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback({ type: "", message: "" });
    try {
      await apimethods.putApi("/protected/update", form);
      setFeedback({ type: "success", message: "Contact details saved." });
    } catch (error) {
      setFeedback({ type: "error", message: error?.response?.data?.message || "Unable to save contact details." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading settings...</p>;

  return (
    <div className="max-w-3xl">
      <div className="mb-6"><h1 className="text-xl font-semibold text-[#333] sm:text-2xl">Contact settings</h1><p className="mt-1 text-sm text-gray-500">These details are shown on the storefront contact page.</p></div>
      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          {[["name", "Admin name"], ["email", "Email address"], ["phone", "Phone number"], ["location", "Location"]].map(([name, label]) => (
            <label key={name} className="text-sm font-medium text-gray-700">{label}<input name={name} type={name === "email" ? "email" : "text"} value={form[name] || ""} onChange={handleChange} required={name === "name" || name === "email"} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" /></label>
          ))}
        </div>
        <label className="block text-sm font-medium text-gray-700">Address<textarea name="address" value={form.address || ""} onChange={handleChange} rows="3" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" /></label>
        {feedback.message && <p className={`text-sm ${feedback.type === "success" ? "text-green-700" : "text-red-600"}`}>{feedback.message}</p>}
        <button type="submit" disabled={saving} className="rounded-lg bg-[#00491B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#019D3E] disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Saving..." : "Save contact details"}</button>
      </form>
    </div>
  );
};

export default Settings;