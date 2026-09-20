import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, AlertCircle, RotateCcw, Save, ExternalLink } from "lucide-react";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  onReset?: () => void;
  altText?: string;
  onAltChange?: (alt: string) => void;
  descriptionPrompt?: string;
  onPromptChange?: (prompt: string) => void;
  aspectRatio?: "square" | "video" | "portrait" | "banner" | "wide";
  recommendedSize?: string;
  placeholder?: string;
  compact?: boolean;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  value,
  onChange,
  defaultValue,
  onReset,
  altText,
  onAltChange,
  descriptionPrompt,
  onPromptChange,
  aspectRatio = "wide",
  recommendedSize,
  placeholder = "/logo.png",
  compact = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageMeta, setImageMeta] = useState<{
    width?: number;
    height?: number;
    size?: string;
    format?: string;
    isValid: boolean;
    errorMsg?: string;
  }>({ isValid: true });

  // Infer recommended dimension if not explicitly provided
  const targetSize = recommendedSize || (() => {
    switch (aspectRatio) {
      case "banner": return "1920 × 600 px (Banner)";
      case "video": return "1200 × 675 px (16:9 HD)";
      case "portrait": return "400 × 500 px (Portrait)";
      case "square": return "500 × 500 px (1:1 Square)";
      case "wide":
      default: return "1200 × 800 px (3:2 Landscape)";
    }
  })();

  const extractCleanFormat = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("data:image/")) {
      const mime = url.substring(11, url.indexOf(";"));
      return mime.replace("+xml", "").toUpperCase();
    }
    const clean = url.split("?")[0].split("#")[0];
    const match = clean.match(/\.([a-zA-Z0-9]+)$/);
    if (match) {
      const ext = match[1].toUpperCase();
      if (["PNG", "JPG", "JPEG", "WEBP", "SVG", "GIF", "AVIF"].includes(ext)) {
        return ext === "JPEG" ? "JPG" : ext;
      }
    }
    if (url.includes("unsplash.com") || url.startsWith("http")) {
      return "WEB IMAGE";
    }
    return "IMAGE";
  };

  // Read image dimensions and validate when value changes
  useEffect(() => {
    if (!value) {
      setImageMeta({ isValid: true });
      return;
    }

    // Check if value is short initials badge (e.g. "PVR", "KC", "SV")
    if (value.length <= 4 && !value.includes("/") && !value.includes(".")) {
      setImageMeta({
        isValid: true,
        format: "INITIALS",
        size: "Avatar Badge"
      });
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const format = extractCleanFormat(value);
      let sizeStr = "";
      if (value.startsWith("data:")) {
        const bytes = Math.round((value.length * 3) / 4);
        sizeStr = bytes > 1024 * 1024 
          ? `${(bytes / (1024 * 1024)).toFixed(2)} MB` 
          : `${Math.round(bytes / 1024)} KB`;
      } else if (value.startsWith("/")) {
        sizeStr = "Local Asset";
      }

      setImageMeta({
        width: img.naturalWidth || undefined,
        height: img.naturalHeight || undefined,
        size: sizeStr,
        format,
        isValid: true
      });
    };
    img.onerror = () => {
      setImageMeta({
        isValid: false,
        errorMsg: "Image failed to load or invalid link format"
      });
    };
    img.src = value;
  }, [value]);

  const processFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageMeta({
        isValid: false,
        errorMsg: "Invalid file type. Please upload PNG, JPG, WebP, SVG, or GIF."
      });
      alert("Invalid file: Please upload a valid image file (PNG, JPG, SVG, WebP, GIF).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setImageMeta({
        isValid: false,
        errorMsg: "File size exceeds 8MB limit."
      });
      alert("File size exceeds 8MB. Please upload a smaller image.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        onChange(event.target.result);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setImageMeta({
        isValid: false,
        errorMsg: "Failed to read image file."
      });
      alert("Failed to read image file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const getAspectClass = () => {
    if (compact) {
      switch (aspectRatio) {
        case "square": return "aspect-square w-full max-h-36";
        case "portrait": return "aspect-[3/4] w-full max-h-40";
        case "banner": return "aspect-[21/9] w-full max-h-24";
        case "video": return "aspect-video w-full max-h-32";
        default: return "aspect-[16/10] w-full max-h-32";
      }
    }
    switch (aspectRatio) {
      case "square": return "aspect-square w-28";
      case "portrait": return "aspect-[3/4] w-28";
      case "banner": return "aspect-[21/9] w-full max-w-[280px]";
      case "video": return "aspect-video w-44";
      default: return "aspect-[16/10] w-36";
    }
  };

  if (compact) {
    return (
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`space-y-2 p-2.5 rounded-xl border transition-all text-left w-full min-w-0 overflow-hidden ${
          isDragging 
            ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/30" 
            : "bg-slate-50/70 border-gray-200/80"
        }`}
      >
        <div className="flex items-center justify-between gap-1 pb-1 border-b border-gray-200/50">
          <label className="text-[10px] font-black text-[#072A6C] uppercase tracking-wider truncate flex items-center gap-1">
            <ImageIcon size={11} className="text-[#072A6C] shrink-0" />
            <span className="truncate">{label}</span>
          </label>
          <div className="flex items-center gap-1 shrink-0">
            {(defaultValue || onReset) && (
              <button
                type="button"
                onClick={() => onReset ? onReset() : onChange(defaultValue || "")}
                className="px-1.5 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-bold cursor-pointer"
                title="Reset photo"
              >
                Reset
              </button>
            )}
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[9px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail preview */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`${getAspectClass()} rounded-lg bg-white border ${
            isDragging ? "border-dashed border-blue-500" : "border-gray-200"
          } overflow-hidden relative shadow-xs flex items-center justify-center cursor-pointer group mx-auto`}
          title="Click to replace photo"
        >
          {value ? (
            value.length <= 4 && !value.includes("/") && !value.includes(".") ? (
              <div className="w-full h-full bg-[#072A6C] text-[#D4AF37] font-black flex items-center justify-center text-xs tracking-wider">
                {value}
              </div>
            ) : (
              <>
                <img
                  src={value}
                  alt={altText || label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = placeholder || "/logo.png?v=3";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-0.5">
                  <UploadCloud size={14} />
                  <span>Upload</span>
                </div>
              </>
            )
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-gray-400 text-center">
              <UploadCloud size={16} className="mb-0.5 text-gray-400" />
              <span className="text-[9px] font-bold text-gray-500">Click to upload</span>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
              Processing...
            </div>
          )}
        </div>

        {/* Input & Browse */}
        <div className="space-y-1.5 w-full min-w-0">
          <div className="flex gap-1 items-center w-full min-w-0">
            <input
              type="text"
              placeholder="Image URL..."
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 min-w-0 h-7 px-2 text-[10px] bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 font-mono text-gray-700"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 px-2 bg-[#072A6C] hover:bg-[#051c4a] text-white text-[10px] font-bold rounded-md flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <UploadCloud size={11} />
              Browse
            </button>
          </div>

          <div className="text-[9px] text-gray-500 flex items-center justify-between">
            <span className="font-semibold truncate">Target: {targetSize}</span>
            {imageMeta.isValid && value && (
              <span className="text-emerald-700 font-bold shrink-0">✓ Valid</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`space-y-2 p-3.5 rounded-xl border transition-all text-left w-full min-w-0 overflow-hidden ${
        isDragging 
          ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/30 scale-[1.01]" 
          : "bg-slate-50/70 border-gray-200/80"
      }`}
    >
      {/* Header with Title & Prominent Valid Size Tag & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1 border-b border-gray-200/50">
        <label className="text-[11px] font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon size={13} className="text-[#072A6C]" />
          {label}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#072A6C] border border-blue-200/80 text-[10px] font-extrabold tracking-tight">
            📐 Valid Size: {targetSize}
          </span>
          {(defaultValue || onReset) && (
            <button
              type="button"
              onClick={() => onReset ? onReset() : onChange(defaultValue || "")}
              className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              title="Reset photo to initial default"
            >
              <RotateCcw size={10} /> Reset Photo
            </button>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer hover:underline"
            >
              <X size={11} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 pt-1 w-full min-w-0">
        {/* Preview Container / Drop Zone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`${getAspectClass()} rounded-lg bg-white border ${
            isDragging ? "border-dashed border-blue-500 bg-blue-50/50" : "border-gray-200"
          } overflow-hidden relative shadow-xs shrink-0 flex items-center justify-center cursor-pointer group`}
          title="Click or drag & drop to replace photo"
        >
          {value ? (
            value.length <= 4 && !value.includes("/") && !value.includes(".") ? (
              <div className="w-full h-full bg-[#072A6C] text-[#D4AF37] font-black flex items-center justify-center text-base tracking-wider shadow-inner">
                {value}
              </div>
            ) : (
              <>
                <img
                  src={value}
                  alt={altText || label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = placeholder || "/logo.png?v=3";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1">
                  <UploadCloud size={16} />
                  <span>Replace</span>
                </div>
              </>
            )
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-gray-400 text-center">
              <UploadCloud size={20} className="mb-1 text-gray-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-[10px] font-bold text-gray-500">Drag & Drop</span>
              <span className="text-[8.5px] text-gray-400">or click to upload</span>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
              Processing...
            </div>
          )}
        </div>

        {/* Input & Upload Controls & Validation Status */}
        <div className="flex-1 space-y-2 w-full min-w-0">
          <div className="flex gap-2 items-center w-full min-w-0">
            <input
              type="text"
              placeholder="Enter image URL or drag photo here..."
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 min-w-0 h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 font-mono text-gray-700"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif,image/avif"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              <UploadCloud size={13} />
              Browse
            </button>
          </div>

          {/* Validation & Size / Dimensions Badge */}
          {value ? (
            <div className="flex flex-wrap items-center gap-1.5 w-full min-w-0">
              {imageMeta.isValid ? (
                <div className="inline-flex flex-wrap items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200/90 rounded-lg text-[10.5px] font-bold text-emerald-800 shadow-xs max-w-full">
                  <span className="flex items-center gap-1 text-emerald-700 truncate">
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    ✓ Valid Photo {imageMeta.format ? `(${imageMeta.format})` : ""}
                  </span>
                  {imageMeta.width && imageMeta.height ? (
                    <span className="text-emerald-900 bg-emerald-100/70 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                      {imageMeta.width} × {imageMeta.height} px
                    </span>
                  ) : null}
                  {imageMeta.size && (
                    <span className="text-emerald-700 font-mono text-[10px] shrink-0">
                      • {imageMeta.size}
                    </span>
                  )}
                  <span className="text-emerald-700/80 font-medium text-[10px] truncate">
                    (Target: {targetSize})
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg text-[10.5px] font-bold text-red-800">
                  <AlertCircle size={12} className="text-red-600 shrink-0" />
                  <span>{imageMeta.errorMsg || "Invalid Image format or broken link"}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-[10px] text-gray-500 bg-white/80 px-2.5 py-1 rounded-md border border-dashed border-gray-200 inline-flex items-center gap-2">
              <span className="font-bold text-[#072A6C]">📐 Target Size: {targetSize}</span>
              <span className="text-gray-400">• Max 8MB (PNG, JPG, WebP, SVG)</span>
            </div>
          )}

          {/* Optional Alt Text & Image Prompt */}
          {(onAltChange || onPromptChange) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {onAltChange && (
                <input
                  type="text"
                  placeholder="Alt text / description for screen readers"
                  value={altText || ""}
                  onChange={(e) => onAltChange(e.target.value)}
                  className="h-7 px-2 text-[11px] bg-slate-50 border border-gray-200 rounded font-medium"
                />
              )}
              {onPromptChange && (
                <input
                  type="text"
                  placeholder="AI description prompt or notes"
                  value={descriptionPrompt || ""}
                  onChange={(e) => onPromptChange(e.target.value)}
                  className="h-7 px-2 text-[11px] bg-slate-50 border border-gray-200 rounded font-medium"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presetColors?: string[];
  defaultValue?: string;
  onReset?: () => void;
}

export const ColorField: React.FC<ColorFieldProps> = ({
  label,
  value,
  onChange,
  presetColors = ["#072A6C", "#D4AF37", "#D71920", "#FFFFFF", "#F8FAFC", "#0F172A", "#64748B", "#10B981"],
  defaultValue,
  onReset
}) => {
  return (
    <div className="space-y-1.5 bg-slate-50/50 p-2.5 rounded-xl border border-gray-200/60 text-left">
      <div className="flex items-center justify-between">
        <label className="text-[10.5px] font-bold text-gray-700 uppercase tracking-wider block">
          {label}
        </label>
        {(defaultValue || onReset) && (
          <button
            type="button"
            onClick={() => onReset ? onReset() : onChange(defaultValue || "")}
            className="text-[9px] font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-lg border border-gray-300 shadow-xs shrink-0 relative overflow-hidden cursor-pointer"
          style={{ backgroundColor: value || "#FFFFFF" }}
        >
          <input
            type="color"
            value={value || "#072A6C"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#072A6C"
          className="w-24 h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg font-mono uppercase focus:outline-none focus:border-blue-500 text-gray-800"
        />
        <div className="flex items-center gap-1 overflow-x-auto">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className="w-5 h-5 rounded-full border border-gray-300 transition-transform hover:scale-115 cursor-pointer shrink-0"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  onSave?: () => void;
  onReset?: () => void;
  resetLabel?: string;
  isSaving?: boolean;
  saveSuccess?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  onSave,
  onReset,
  resetLabel,
  isSaving,
  saveSuccess
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-gray-200 text-left">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#072A6C]/10 text-[#072A6C] flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black text-[#072A6C] uppercase tracking-tight">{title}</h2>
          <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="h-9 px-3.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-300 hover:border-red-300 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Revert modifications in this section to default values"
          >
            <RotateCcw size={13} />
            {resetLabel || "Reset Changes"}
          </button>
        )}

        {onSave && (
          <>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <CheckCircle2 size={14} /> Saved!
              </span>
            )}
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={14} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

interface VideoFieldProps {
  label: string;
  value: string;
  onChange: (value: string, sizeMb?: string) => void;
  sizeMb?: string;
  onSizeChange?: (sizeMb: string) => void;
  maxSizeMb?: number;
  recommendedLimit?: string;
  poster?: string;
}

export const VideoField: React.FC<VideoFieldProps> = ({
  label,
  value,
  onChange,
  sizeMb,
  onSizeChange,
  maxSizeMb = 50,
  recommendedLimit = "Max 50.0 MB (MP4, WebM, OGG)",
  poster
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [videoStatus, setVideoStatus] = useState<{
    isValid: boolean;
    sizeMbStr: string;
    errorMsg?: string;
  }>({
    isValid: true,
    sizeMbStr: sizeMb || ""
  });

  const processVideoFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setVideoStatus({
        isValid: false,
        sizeMbStr: "",
        errorMsg: "Invalid format. Please upload MP4, WebM, or OGG video."
      });
      alert("Please upload a valid video file (MP4, WebM, OGG).");
      return;
    }

    const calculatedMb = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const sizeInMbNum = file.size / (1024 * 1024);

    if (sizeInMbNum > maxSizeMb) {
      setVideoStatus({
        isValid: false,
        sizeMbStr: calculatedMb,
        errorMsg: `Video file size (${calculatedMb}) exceeds the ${maxSizeMb} MB limit.`
      });
      alert(`Video size (${calculatedMb}) is larger than the recommended maximum of ${maxSizeMb} MB. Please optimize or compress the video.`);
    } else {
      setVideoStatus({
        isValid: true,
        sizeMbStr: calculatedMb
      });
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        onChange(event.target.result, calculatedMb);
        if (onSizeChange) onSizeChange(calculatedMb);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert("Failed to read video file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processVideoFile(file);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`space-y-3 p-4 rounded-xl border transition-all text-left ${
        isDragging
          ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-400/30 scale-[1.01]"
          : "bg-slate-50/80 border-gray-200/80"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1 border-b border-gray-200/50">
        <label className="text-[11px] font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-1.5">
          🎬 {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#072A6C] border border-blue-200/80 text-[10px] font-extrabold tracking-tight">
            📐 Video Limits: {recommendedLimit}
          </span>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("", "");
                if (onSizeChange) onSizeChange("");
              }}
              className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer hover:underline"
            >
              <X size={11} /> Remove Video
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Video Player Preview Box */}
        <div className="md:col-span-5 aspect-video w-full rounded-xl bg-black overflow-hidden relative shadow-md flex items-center justify-center border border-gray-300">
          {value ? (
            <video
              src={value}
              poster={poster}
              controls
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 text-gray-400 text-center cursor-pointer group"
            >
              <UploadCloud size={24} className="mb-1 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-[11px] font-bold text-gray-300">Drop Video File</span>
              <span className="text-[9px] text-gray-500">(MP4, WebM up to 50MB)</span>
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
              <span>Uploading & Processing Video...</span>
            </div>
          )}
        </div>

        {/* URL Input & Browse Controls */}
        <div className="md:col-span-7 space-y-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 uppercase">Video URL or Source</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter video URL (e.g. /chalapathi_logo_intro.mp4 or https://...)"
                value={value || ""}
                onChange={(e) => onChange(e.target.value, sizeMb)}
                className="flex-1 h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-gray-700"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processVideoFile(file);
                }}
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <UploadCloud size={13} />
                Upload MP4
              </button>
            </div>
          </div>

          {/* Video Size & Validation Meta */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {value ? (
              videoStatus.isValid ? (
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[10.5px] font-bold text-emerald-800 shadow-xs">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  <span>✅ Valid Video File</span>
                  {(videoStatus.sizeMbStr || sizeMb) && (
                    <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">
                      Size: {videoStatus.sizeMbStr || sizeMb}
                    </span>
                  )}
                  <span className="text-emerald-600 font-medium text-[10px]">
                    (Max Limit: {maxSizeMb} MB)
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg text-[10.5px] font-bold text-red-800">
                  <AlertCircle size={12} className="text-red-600 shrink-0" />
                  <span>{videoStatus.errorMsg || "Invalid video format"}</span>
                </div>
              )
            ) : (
              <div className="text-[10px] text-gray-500 bg-white/80 px-2.5 py-1 rounded-md border border-dashed border-gray-200">
                <span className="font-bold text-[#072A6C]">📐 Target Limits:</span> Maximum {maxSizeMb}MB • MP4, WebM format
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

