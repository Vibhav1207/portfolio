"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Upload } from "lucide-react";
import Sidebar from "@/app/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [certType, setCertType] = useState<'achievement' | 'course' | 'internship'>('course');
  const [subtitle, setSubtitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [proofUrl, setProofUrl] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCertificates();

    const channel = supabase
      .channel("certificates-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "certificates",
        },
        () => {
          fetchCertificates();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCertificates = async () => {
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .order("created_at", {
      ascending: true,
    });

  setCertificates(data || []);
  setLoading(false);
};

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setImage(null);
    setPreview("");
    setEditId(null);
    setCertType('course');
    setStartDate("");
    setEndDate("");
    setStatus("");
    setProofUrl("");
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);

    let imageUrl = preview;

    if (image) {
      const fileName = `certificate-${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("certificates")
        .upload(fileName, image);

      if (uploadError) {
        setSaving(false);
        Swal.fire({
          title: "Upload Failed",
          text: uploadError.message,
          icon: "error",
          background: "#111",
          color: "#fff",
        });
        return;
      }

      const { data } = supabase.storage
        .from("certificates")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    let error;
    if (editId) {
      const res = await supabase
        .from("certificates")
        .update({
          title,
          subtitle: subtitle || null,
          image_url: imageUrl,
          type: certType,
          proof_url: proofUrl || null,
          start_date: startDate || null,
          end_date: endDate || null,
          status: status || null,
        })
        .eq("id", editId);
      error = res.error;
    } else {
      const res = await supabase.from("certificates").insert([
        {
          title,
          subtitle: subtitle || null,
          image_url: imageUrl,
          type: certType,
          proof_url: proofUrl || null,
          start_date: startDate || null,
          end_date: endDate || null,
          status: status || null,
        },
      ]);
      error = res.error;
    }

    setSaving(false);

    if (error) {
      Swal.fire({
        title: "Save Failed",
        text: error.message || "Failed to save certificate.",
        icon: "error",
        background: "#111",
        color: "#fff",
      });
      return;
    }

    Swal.fire({
      title: "Saved!",
      text: "Certificate saved successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#111",
      color: "#fff",
    });

    setOpen(false);
    resetForm();
    fetchCertificates();
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Certificate?",
      text: "Certificate yang dihapus tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#27272a",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("certificates").delete().eq("id", id);

    if (!error) {
      setCertificates((prev) => prev.filter((item) => item.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "Certificate berhasil dihapus.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        background: "#111",
        color: "#fff",
      });
    } else {
      Swal.fire({
        title: "Failed",
        text: "Gagal menghapus certificate.",
        icon: "error",
        background: "#111",
        color: "#fff",
      });
    }
  };

  const handleEdit = (item: any) => {
    setTitle(item.title);
    setSubtitle(item.subtitle || "");
    setPreview(item.image_url);
    setEditId(item.id);
    setCertType(item.type || 'course');
    setProofUrl(item.proof_url || "");
    setStartDate(item.start_date || "");
    setEndDate(item.end_date || "");
    setStatus(item.status || "");
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="lg:ml-[250px] min-h-screen px-4 sm:px-6 lg:px-8 pt-[90px] lg:pt-6 pb-6">
        <div className="py-6 lg:py-8">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Certificates</h1>

              <p className="text-sm text-white/40 mt-1">
                Manage your certificates
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-black hover:scale-[1.02] transition"
            >
              <Plus size={16} />
              Add Certificate
            </button>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="text-white/50 text-sm">Loading certificates...</div>
          ) : certificates.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] h-[240px] flex items-center justify-center text-white/35">
              No certificates found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 pb-6">
              {certificates.map((item) => (
                <div
                  key={item.id}
                  className="border border-white/10 bg-white/[0.03] rounded-2xl p-4 hover:border-white/25 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* IMAGE */}
                  <div className="w-full h-[150px] rounded-xl overflow-hidden bg-white/[0.03] mb-4">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/[0.03]" />
                    )}
                  </div>

                  {/* TITLE + TYPE */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h2 className="font-semibold text-[15px] line-clamp-2 min-h-[42px] flex-1">
                      {item.title}
                    </h2>
                    {item.type && (
                      <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                        item.type === 'achievement'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : item.type === 'internship'
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                          : 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                      }`}>
                        {item.type === 'achievement' ? '🏆' : item.type === 'internship' ? '💼' : '📚'} {item.type}
                      </span>
                    )}
                  </div>

                  {/* SUBTITLE */}
                  {item.subtitle && (
                    <p className="text-[12px] text-white/60 mb-2 truncate">
                      {item.subtitle}
                    </p>
                  )}

                  {/* DATE & STATUS */}
                  {(item.start_date || item.end_date || item.status) && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2 text-[11px] text-white/40" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {(item.start_date || item.end_date) && (
                        <span>📅 {item.start_date || 'N/A'} - {item.end_date || 'Present'}</span>
                      )}
                      {item.status && (
                        <span className="px-1.5 py-0.2 rounded border border-white/10 bg-white/5">{item.status}</span>
                      )}
                    </div>
                  )}

                  {/* DATE */}
                  <span className="text-[11px] text-white/30 mb-4">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : "No Date"}
                  </span>

                  {/* ACTION */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition flex items-center justify-center gap-2 text-sm"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition flex items-center justify-center text-red-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center px-3 sm:px-4 py-4">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#111] border border-white/10 p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg sm:text-xl font-semibold">
                {editId ? "Edit Certificate" : "Add Certificate"}
              </h2>

              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* IMAGE */}
            <label className="border border-dashed border-white/10 rounded-2xl bg-[#0f0f0f] h-44 sm:h-52 flex flex-col items-center justify-center cursor-pointer overflow-hidden mb-4">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={24} className="text-white/50 mb-2" />

                  <p className="text-sm text-white/60">
                    Upload Certificate Image
                  </p>
                </>
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImage}
              />
            </label>

            {/* TITLE */}
            <input
              placeholder="Certificate Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#0f0f0f] border border-white/10 outline-none mb-4 text-sm"
            />

            {/* SUBTITLE */}
            <input
              placeholder="Subtitle (e.g., Organization, Issuer) (optional)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#0f0f0f] border border-white/10 outline-none mb-4 text-sm"
            />

            {/* TYPE */}
            <div className="mb-4">
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-2 block" style={{ fontFamily: "'DM Mono', monospace" }}>Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCertType('course')}
                  className={`flex-1 px-3 py-2.5 rounded-2xl border text-xs sm:text-sm transition-all ${
                    certType === 'course'
                      ? 'bg-violet-500/15 border-violet-500/30 text-violet-300'
                      : 'bg-[#0f0f0f] border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  📚 Course
                </button>
                <button
                  type="button"
                  onClick={() => setCertType('achievement')}
                  className={`flex-1 px-3 py-2.5 rounded-2xl border text-xs sm:text-sm transition-all ${
                    certType === 'achievement'
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      : 'bg-[#0f0f0f] border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  🏆 Award
                </button>
                <button
                  type="button"
                  onClick={() => setCertType('internship')}
                  className={`flex-1 px-3 py-2.5 rounded-2xl border text-xs sm:text-sm transition-all ${
                    certType === 'internship'
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                      : 'bg-[#0f0f0f] border-white/10 text-white/50 hover:border-white/20'
                  }`}
                >
                  💼 Intern
                </button>
              </div>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-wider mb-2 block" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Start Date {certType !== 'internship' && '(optional)'}
                </label>
                <input
                  placeholder="e.g. May 2025"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0f0f0f] border border-white/10 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-wider mb-2 block" style={{ fontFamily: "'DM Mono', monospace" }}>
                  End Date {certType !== 'internship' && '(optional)'}
                </label>
                <input
                  placeholder="e.g. Present"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0f0f0f] border border-white/10 outline-none text-sm"
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="mb-4">
              <label className="text-[11px] text-white/40 uppercase tracking-wider mb-2 block" style={{ fontFamily: "'DM Mono', monospace" }}>
                Status {certType !== 'internship' && '(optional)'}
              </label>
              <input
                placeholder="e.g. Completed, Ongoing"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#0f0f0f] border border-white/10 outline-none text-sm"
              />
            </div>

            {/* PROOF URL */}
            <input
              placeholder="Proof URL (optional — link to credential)"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#0f0f0f] border border-white/10 outline-none mb-5 text-sm"
            />

            {/* BUTTON */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-black font-medium"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
