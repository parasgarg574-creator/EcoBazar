import { useEffect, useState, useCallback } from "react";
import { FiExternalLink, FiMail, FiMapPin, FiPhone, FiSend, FiNavigation, FiCheckCircle, FiLayers } from "react-icons/fi";
import Navbar from "../../Component/Navbar";
import Footer from "../../Component/Footer";
import apimethods from "../../Methods/ApiClient";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useShop } from "../../Context/ShopContext";

const LOCATION_STORAGE_KEY = "ecobazar_user_location";
const initialForm = { name: "", email: "", subject: "", message: "" };

// Custom Leaflet marker icon to ensure correct rendering across browsers
const customIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Helper component to smoothly re-center map when location changes
function RecenterMap({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (coords?.lat && coords?.lng) {
            map.flyTo([coords.lat, coords.lng], Math.max(map.getZoom(), 14), { duration: 1 });
        }
    }, [coords, map]);
    return null;
}

const Contact = () => {
    const { setToastMessage } = useShop() || {};
    const [details, setDetails] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", message: "" });
    const [tileType, setTileType] = useState("google"); // "google" | "osm"

    // Default map position (Chandigarh / Mohali region)
    const [selectedCoords, setSelectedCoords] = useState({
        lat: 30.7225141,
        lng: 76.6968409
    });

    const [userLocationName, setUserLocationName] = useState(() => {
        try {
            return localStorage.getItem(LOCATION_STORAGE_KEY) || "Lincoln- 344, Illinois, Chicago, USA";
        } catch {
            return "Lincoln- 344, Illinois, Chicago, USA";
        }
    });

    const [isGeocoding, setIsGeocoding] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Fetch contact details from backend
    useEffect(() => {
        let active = true;
        apimethods.getApi("/public/contact-details")
            .then((response) => {
                if (active) setDetails(response?.data?.data || null);
            })
            .catch(() => {
                if (active) setDetails(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    // Listen for location changes from other components / navbar
    useEffect(() => {
        const handleLocationUpdate = (e) => {
            if (e?.detail) {
                setUserLocationName(e.detail);
            } else {
                try {
                    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
                    if (saved) setUserLocationName(saved);
                } catch {
                    // ignore
                }
            }
        };
        window.addEventListener("locationUpdated", handleLocationUpdate);
        window.addEventListener("storage", handleLocationUpdate);
        return () => {
            window.removeEventListener("locationUpdated", handleLocationUpdate);
            window.removeEventListener("storage", handleLocationUpdate);
        };
    }, []);

    const handleChange = (event) => {
        setForm((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    // Perform reverse geocoding when map is clicked
    const handleMapClick = useCallback(async (lat, lng) => {
        setSelectedCoords({ lat, lng });
        setIsGeocoding(true);

        let finalLoc = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

        try {
            const res = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || "";
            const state = data.principalSubdivision || "";
            const country = data.countryName || "";
            const formatted = [city, state, country].filter(Boolean).join(", ");
            if (formatted) finalLoc = formatted;
        } catch {
            try {
                const osmRes = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const osmData = await osmRes.json();
                const address = osmData.address || {};
                const city = address.city || address.town || address.village || address.county || "";
                const state = address.state || "";
                const country = address.country || "";
                const formatted = [city, state, country].filter(Boolean).join(", ");
                if (formatted) finalLoc = formatted;
            } catch {
                finalLoc = `Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            }
        } finally {
            setIsGeocoding(false);
        }

        setUserLocationName(finalLoc);
        setLastUpdated(new Date().toLocaleTimeString());
        localStorage.setItem(LOCATION_STORAGE_KEY, finalLoc);
        window.dispatchEvent(new CustomEvent("locationUpdated", { detail: finalLoc }));

        if (setToastMessage) {
            setToastMessage(`Navbar location set to: ${finalLoc} 📍`);
        }
    }, [setToastMessage]);

    // Detect browser current location
    const handleDetectCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        setIsGeocoding(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                handleMapClick(latitude, longitude);
            },
            () => {
                setIsGeocoding(false);
                alert("Could not access your location. Please click on the map manually.");
            }
        );
    };

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        selectedCoords.lat + "," + selectedCoords.lng
    )}`;

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSending(true);
        setFeedback({ type: "", message: "" });
        try {
            const response = await apimethods.postApi("/contact-messages", form);
            setFeedback({
                type: "success",
                message: response?.data?.message || "Your question has been sent.",
            });
            setForm(initialForm);
        } catch (error) {
            setFeedback({
                type: "error",
                message: error?.response?.data?.message || "We could not send your question. Please try again.",
            });
        } finally {
            setSending(false);
        }
    };

    const contactItems = [
        {
            icon: FiMapPin,
            label: "Visit us",
            value: userLocationName || details?.address || "Contact details are being updated",
        },
        {
            icon: FiMail,
            label: "Email us",
            value: details?.email || "Email address not available",
        },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-[#f7f8f9]">
            <Navbar />
            <main className="flex-1">
                <section className="border-b border-green-100 bg-[#eef9f0]">
                    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">We are here to help</p>
                        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Let&apos;s talk about your next basket.</h1>
                        <p className="mt-4 max-w-xl text-base leading-7 text-gray-600">Have a question about an order, product, or delivery? Send us a message or select your store location on the interactive map below.</p>
                    </div>
                </section>
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-12">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900">Contact details</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500">Reach the EcoBazar team through the details below.</p>
                        <div className="mt-7 space-y-4">
                            {loading ? (
                                <p className="text-sm text-gray-500">Loading contact details...</p>
                            ) : (
                                contactItems.map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                                            <Icon size={20} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
                                            <p className="mt-1 wrap-break-word text-sm font-medium text-gray-800">{value}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-900">Ask a question</h2>
                        <p className="mt-2 text-sm text-gray-500">Include your email so we can reply to you.</p>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Name
                                    <input name="name" value={form.name} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                                </label>
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                    <input type="email" name="email" value={form.email} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                                </label>
                            </div>
                            <label className="block text-sm font-medium text-gray-700">
                                Subject
                                <input name="subject" value={form.subject} onChange={handleChange} required className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">
                                Your question
                                <textarea name="message" value={form.message} onChange={handleChange} required rows="5" className="mt-2 w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" />
                            </label>
                            {feedback.message && (
                                <p role="status" className={`text-sm ${feedback.type === "success" ? "text-green-700" : "text-red-600"}`}>
                                    {feedback.message}
                                </p>
                            )}
                            <button type="submit" disabled={sending} className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60">
                                <FiSend size={17} />
                                {sending ? "Sending..." : "Send question"}
                            </button>
                        </form>
                    </section>
                </div>
                <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                                    <FiMapPin className="text-green-700" /> Google Map Location Selector
                                </div>
                                <h2 className="mt-2 text-2xl font-bold text-gray-900">Click Map to Set Navbar Location</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Click anywhere on the map to choose your delivery location. The location on top of the navbar will update automatically!
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleDetectCurrentLocation}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-green-700"
                                >
                                    <FiNavigation size={14} className="text-green-600" />
                                    Locate Me
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTileType((prev) => (prev === "google" ? "osm" : "google"))}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                                >
                                    <FiLayers size={14} />
                                    {tileType === "google" ? "Google Map View" : "OpenStreetMap View"}
                                </button>
                            </div>
                        </div>
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-green-50 border border-green-200 p-4 text-sm text-green-900">
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                                    <FiCheckCircle size={18} />
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        Navbar Location: <span className="text-green-700">{isGeocoding ? "Detecting location address..." : userLocationName}</span>
                                    </p>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                        {isGeocoding
                                            ? "Finding address details for your clicked map point..."
                                            : "This location is currently active and displayed at the top of your navbar."}
                                    </p>
                                </div>
                            </div>
                            {lastUpdated && (
                                <span className="text-xs font-medium text-green-700 bg-white px-2.5 py-1 rounded-md border border-green-200">
                                    Updated at {lastUpdated}
                                </span>
                            )}
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-inner">
                            <div className="relative h-[440px] w-full">
                                <MapContainer
                                    center={[selectedCoords.lat, selectedCoords.lng]}
                                    zoom={15}
                                    scrollWheelZoom={true}
                                    className="h-full w-full z-0 cursor-crosshair"
                                >
                                    {tileType === "google" ? (
                                        <TileLayer
                                            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                                            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                            maxZoom={20}
                                        />
                                    ) : (
                                        <TileLayer
                                            attribution='&copy; OpenStreetMap contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                    )}
                                    <MapClickHandler onMapClick={handleMapClick} />
                                    <RecenterMap coords={selectedCoords} />
                                    <Marker position={[selectedCoords.lat, selectedCoords.lng]} icon={customIcon}>
                                        <Popup minWidth={220}>
                                            <div className="p-1">
                                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-green-700">
                                                    <FiMapPin /> Selected Location
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900 leading-snug">
                                                    {userLocationName}
                                                </p>
                                                <p className="mt-1 text-[11px] text-gray-500">
                                                    {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
                                                </p>
                                                <div className="mt-2.5 inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-[11px] font-semibold text-green-800">
                                                    <FiCheckCircle size={12} /> Active in Navbar
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                                <div className="absolute top-3 left-3 z-[1000] pointer-events-none rounded-xl bg-gray-900/80 backdrop-blur-md px-3.5 py-2 text-xs font-medium text-white shadow-lg">
                                    💡 Click anywhere on the map to set location
                                </div>
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`Open ${userLocationName} in Google Maps`}
                                    className="absolute bottom-4 right-4 z-[1000] inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-green-800"
                                >
                                    <FiExternalLink size={15} />
                                    Open in Google Maps App
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};
export default Contact;