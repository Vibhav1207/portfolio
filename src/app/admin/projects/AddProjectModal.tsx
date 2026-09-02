"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadFileToStorage } from "@/lib/storageUtils";
import { Upload, X, Link as LinkIcon, Plus } from "lucide-react";

export default function AddProjectModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [live, setLive] = useState("");
  const [github, setGithub] = useState("");
  const [tech, setTech] = useState("");
  const [features, setFeatures] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [urlInputs, setUrlInputs] = useState<string[]>([]);
  const [customUrl, setCustomUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUrlInput = (index: number) => {
    setUrlInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddUrl = () => {
    if (!customUrl.trim()) return;
    setUrlInputs((prev) => [...prev, customUrl.trim()]);
    setCustomUrl("");
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return showToast("Title wajib diisi");
    if (!desc.trim()) return showToast("Description wajib diisi");
    if (!tech.trim()) return showToast("Tech wajib diisi");
    if (!features.trim()) return showToast("Features wajib diisi");

    if (images.length === 0 && urlInputs.length === 0) {
      return showToast("Upload minimal 1 gambar atau sertakan Image URL");
    }

    setLoading(true);

    try {
      const uploadedUrls: string[] = [...urlInputs];
      let uploadFailedCount = 0;

      for (const image of images) {
        const { publicUrl, error: uploadErr } = await uploadFileToStorage("projects", image);

        if (uploadErr || !publicUrl) {
          uploadFailedCount++;
          console.error("Upload error for file:", image.name, uploadErr);
        } else {
          uploadedUrls.push(publicUrl);
        }
      }

      if (images.length > 0 && uploadedUrls.length === 0) {
        showToast("Gagal mengupload gambar. Periksa koneksi / bucket Supabase.");
        setLoading(false);
        return;
      }

      if (uploadFailedCount > 0) {
        showToast(`${uploadFailedCount} gambar gagal diupload, melanjutkan gambar sisanya.`);
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            title,
            description: desc,
            live_url: live || null,
            github_url: github || null,
            technologies: tech.split(",").map((t) => t.trim()).filter(Boolean),
            key_features: features.split(",").map((f) => f.trim()).filter(Boolean),
            image_url: uploadedUrls[0] || null,
            image_urls: uploadedUrls,
          },
        ])
        .select()
        .single();

      if (error) {
        showToast(`Gagal simpan project: ${error.message || "Error DB"}`);
        setLoading(false);
        return;
      }

      onAdd(data);

      setTitle("");
      setDesc("");
      setLive("");
      setGithub("");
      setTech("");
      setFeatures("");
      setImages([]);
      setPreviews([]);
      setUrlInputs([]);
      setCustomUrl("");

      onClose();
    } catch (err: any) {
      showToast(`Terjadi error: ${err?.message || "Unknown"}`);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-md flex items-center justify-center px-3 sm:px-6 py-6">
      {toast && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm shadow-lg z-50">
          {toast}
        </div>
      )}

      <div className="w-full max-w-[820px] bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* HEADER */}
        <div className="px-4 sm:px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-semibold">
              Add Project
            </h2>

            <p className="text-[11px] sm:text-xs text-white/40 mt-1">
              Simple portfolio input
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
        >
          {/* TITLE + UPLOAD */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
            {/* TITLE */}
            <div>
              <label className="text-xs text-white/50">
                Project Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full mt-2 px-4 py-3 bg-[#111] border border-white/10 rounded-2xl outline-none text-sm"
              />
            </div>

            {/* UPLOAD */}
            <div>
              <label className="text-xs text-white/50 block mb-2">
                Upload
              </label>

              <label className="h-[86px] border border-dashed border-white/15 rounded-2xl bg-[#111] hover:bg-[#151515] transition flex flex-col items-center justify-center cursor-pointer">
                <Upload
                  size={18}
                  className="mb-1 text-white/50"
                />

                <span className="text-[11px] text-white/60">
                  Upload Images
                </span>

                <input
                  type="file"
                  multiple
                  hidden
                  onChange={handleImages}
                />
              </label>
            </div>
          </div>

          {/* IMAGE URL INPUT */}
          <div>
            <label className="text-xs text-white/50 block mb-2">
              Direct Image URL (Optional)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  placeholder="https://example.com/image.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-2xl outline-none text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs flex items-center gap-1 transition shrink-0"
              >
                <Plus size={14} /> Add URL
              </button>
            </div>
          </div>

          {/* PREVIEWS (FILES & URLS) */}
          {(previews.length > 0 || urlInputs.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {previews.map((img, i) => (
                <div
                  key={`file-${i}`}
                  className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#111]"
                >
                  <img
                    src={img}
                    alt="Preview"
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="absolute bottom-1 left-1.5 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-white/70">File</span>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black rounded-full p-1.5"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {urlInputs.map((url, i) => (
                <div
                  key={`url-${i}`}
                  className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#111]"
                >
                  <img
                    src={url}
                    alt="URL Preview"
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="absolute bottom-1 left-1.5 text-[9px] bg-blue-500/60 px-1.5 py-0.5 rounded text-white">URL</span>
                  <button
                    type="button"
                    onClick={() => removeUrlInput(i)}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black rounded-full p-1.5"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs text-white/50">
              Description
            </label>

            <textarea
              value={desc}
              onChange={(e) =>
                setDesc(e.target.value)
              }
              className="w-full mt-2 px-4 py-3 min-h-[110px] bg-[#111] border border-white/10 rounded-2xl outline-none resize-none text-sm"
            />
          </div>

          {/* URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="Live URL"
              value={live}
              onChange={(e) =>
                setLive(e.target.value)
              }
              className="px-4 py-3 bg-[#111] border border-white/10 rounded-2xl outline-none text-sm"
            />

            <input
              placeholder="Github URL"
              value={github}
              onChange={(e) =>
                setGithub(e.target.value)
              }
              className="px-4 py-3 bg-[#111] border border-white/10 rounded-2xl outline-none text-sm"
            />
          </div>

          {/* TECH */}
          <input
            placeholder="Technologies"
            value={tech}
            onChange={(e) =>
              setTech(e.target.value)
            }
            className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-2xl outline-none text-sm"
          />

          {/* FEATURES */}
          <input
            placeholder="Key Features"
            value={features}
            onChange={(e) =>
              setFeatures(e.target.value)
            }
            className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-2xl outline-none text-sm"
          />

          {/* ACTION */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/5 transition text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-black font-medium hover:opacity-90 transition text-sm"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}