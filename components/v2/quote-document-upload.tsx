"use client";

import { ChangeEvent, DragEvent, KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import {
  Check,
  Eye,
  File,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Info,
  Paperclip,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

type UploadKind = "drawing" | "boq" | "waterAnalysis" | "sitePhotos";

type UploadConfig = {
  name: UploadKind;
  title: string;
  multiple?: boolean;
  accept: string;
  acceptedLabel: string;
  maxSizeBytes: number;
  maxSizeLabel: string;
  allowedExtensions: string[];
  allowedMimeTypes: string[];
  formatError: string;
};

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
};

const megabyte = 1024 * 1024;
const uploadConfigs: UploadConfig[] = [
  {
    name: "drawing",
    title: "Drawing",
    accept: ".pdf",
    acceptedLabel: "PDF",
    maxSizeBytes: 10 * megabyte,
    maxSizeLabel: "10 MB",
    allowedExtensions: ["pdf"],
    allowedMimeTypes: ["application/pdf"],
    formatError: "Only PDF files are allowed.",
  },
  {
    name: "boq",
    title: "BOQ / PO",
    accept: ".pdf,.doc,.docx",
    acceptedLabel: "PDF, DOC, DOCX",
    maxSizeBytes: 10 * megabyte,
    maxSizeLabel: "10 MB",
    allowedExtensions: ["pdf", "doc", "docx"],
    allowedMimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    formatError: "Only PDF, DOC, and DOCX files are allowed.",
  },
  {
    name: "waterAnalysis",
    title: "Water Report",
    accept: ".pdf",
    acceptedLabel: "PDF",
    maxSizeBytes: 10 * megabyte,
    maxSizeLabel: "10 MB",
    allowedExtensions: ["pdf"],
    allowedMimeTypes: ["application/pdf"],
    formatError: "Only PDF files are allowed.",
  },
  {
    name: "sitePhotos",
    title: "Images / Other",
    multiple: true,
    accept: ".png",
    acceptedLabel: "PNG",
    maxSizeBytes: 5 * megabyte,
    maxSizeLabel: "5 MB",
    allowedExtensions: ["png"],
    allowedMimeTypes: ["image/png"],
    formatError: "Only PNG images are allowed.",
  },
];

const dangerousExtensions = new Set([
  "app",
  "asp",
  "aspx",
  "bat",
  "cmd",
  "com",
  "cpl",
  "dll",
  "dmg",
  "exe",
  "gadget",
  "hta",
  "html",
  "htm",
  "jar",
  "js",
  "jse",
  "lnk",
  "msi",
  "msp",
  "pif",
  "pkg",
  "ps1",
  "reg",
  "scr",
  "sh",
  "svg",
  "vb",
  "vbe",
  "vbs",
  "wsf",
]);

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 102.4) / 10} KB`;
  }

  return `${Math.round(size / 1024 / 102.4) / 10} MB`;
}

function fileParts(name: string) {
  return name.toLowerCase().split(".").filter(Boolean);
}

function extensionOf(file: File) {
  const parts = fileParts(file.name);
  return parts.at(-1) ?? "";
}

function hasDangerousExtension(name: string) {
  return fileParts(name).some((part) => dangerousExtensions.has(part));
}

function truncateFileName(name: string, maxLength = 30) {
  if (name.length <= maxLength) {
    return name;
  }

  const extension = name.includes(".") ? `.${name.split(".").pop()}` : "";
  const base = extension ? name.slice(0, -extension.length) : name;

  return `${base.slice(0, Math.max(8, maxLength - extension.length - 4))}...${extension}`;
}

function isPreviewable(file: File) {
  return ["png", "pdf"].includes(extensionOf(file));
}

function setInputFiles(input: HTMLInputElement | null, files: File[]) {
  if (!input) {
    return;
  }

  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  input.files = dataTransfer.files;
}

function UploadFileIcon({ file }: { file: File }) {
  const extension = extensionOf(file);

  if (extension === "png") {
    return <ImageIcon className="h-7 w-7" />;
  }

  if (["pdf", "doc", "docx"].includes(extension)) {
    return <FileText className="h-7 w-7" />;
  }

  return <File className="h-7 w-7" />;
}

function QuoteUploadCard({ config }: { config: UploadConfig }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerModeRef = useRef<"replace" | "append">("replace");
  const itemsRef = useRef<UploadItem[]>([]);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<UploadItem | null>(null);
  const inputId = useId();
  const hasFiles = items.length > 0;

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  function validateFiles(files: File[]) {
    const validFiles: File[] = [];

    for (const file of files) {
      const extension = extensionOf(file);

      if (!extension || hasDangerousExtension(file.name)) {
        setSuccess("");
        setError("Unsupported file format.");
        return [];
      }

      if (!config.allowedExtensions.includes(extension)) {
        setSuccess("");
        setError(config.formatError);
        return [];
      }

      if (file.type && !config.allowedMimeTypes.includes(file.type)) {
        setSuccess("");
        setError(config.formatError);
        return [];
      }

      if (file.size > config.maxSizeBytes) {
        setSuccess("");
        setError("Maximum file size exceeded.");
        return [];
      }

      validFiles.push(file);
    }

    setError("");
    setSuccess("File validated successfully.");
    return validFiles;
  }

  function updateFiles(files: File[], mode: "replace" | "append" = "replace") {
    const validFiles = validateFiles(files);

    if (!validFiles.length) {
      setInputFiles(inputRef.current, items.map((item) => item.file));
      return;
    }

    if (mode === "replace") {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    }

    const uploadedItems = validFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    const nextItems = mode === "append" ? [...items, ...uploadedItems] : uploadedItems;

    setItems(nextItems);
    setInputFiles(inputRef.current, nextItems.map((item) => item.file));
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    updateFiles(Array.from(event.target.files ?? []), config.multiple ? pickerModeRef.current : "replace");
    pickerModeRef.current = "replace";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    updateFiles(Array.from(event.dataTransfer.files), config.multiple && hasFiles ? "append" : "replace");
  }

  function removeFile(itemId?: string) {
    const nextItems = itemId ? items.filter((item) => item.id !== itemId) : [];
    const removedItems = itemId ? items.filter((item) => item.id === itemId) : items;

    removedItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems(nextItems);
    setError("");
    setSuccess(nextItems.length ? "File validated successfully." : "");
    setInputFiles(inputRef.current, nextItems.map((item) => item.file));

    if (!nextItems.length && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function openPicker(mode: "replace" | "append" = "replace") {
    pickerModeRef.current = mode;
    inputRef.current?.click();
  }

  function onEmptyKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  }

  return (
    <article className={`b2-doc-card ${hasFiles ? "b2-doc-card-uploaded" : ""}`}>
      <input
        ref={inputRef}
        id={inputId}
        name={config.name}
        type="file"
        accept={config.accept}
        multiple={config.multiple}
        className="b2-doc-input"
        aria-label={`Upload ${config.title}`}
        onChange={onInputChange}
      />

      {!hasFiles ? (
        <div
          className="b2-doc-empty"
          role="button"
          tabIndex={0}
          aria-label={`Upload ${config.title}`}
          onClick={() => openPicker()}
          onKeyDown={onEmptyKeyDown}
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDrop}
        >
          {config.name === "sitePhotos" ? <ImageIcon className="h-10 w-10" /> : <FileText className="h-10 w-10" />}
          <h3>{config.title}</h3>
          <p>Drag &amp; drop file here</p>
          <span>or</span>
          <button
            type="button"
            className="b2-doc-browse"
            onClick={(event) => {
              event.stopPropagation();
              openPicker();
            }}
          >
            <FolderOpen className="h-4 w-4" /> Browse Files
          </button>
          <small>Accepted: {config.acceptedLabel}</small>
          <small>Max Size: {config.maxSizeLabel}</small>
        </div>
      ) : (
        <div className="b2-doc-uploaded">
          <div className="b2-doc-uploaded-head">
            <span className="b2-doc-success-icon"><Check className="h-4 w-4" /></span>
            <h3>{config.title}</h3>
            <strong>Validated</strong>
          </div>

          <div className="b2-doc-file-list">
            {items.map((item) => (
              <div key={item.id} className="b2-doc-file-row">
                <span className="b2-doc-file-icon">
                  <UploadFileIcon file={item.file} />
                </span>
                <span className="b2-doc-file-meta">
                  <strong title={item.file.name}>{truncateFileName(item.file.name)}</strong>
                  <small>{formatBytes(item.file.size)}</small>
                </span>
                <span className="b2-doc-file-actions" aria-label={`${item.file.name} actions`}>
                  <button
                    type="button"
                    title={isPreviewable(item.file) ? "Preview" : "Preview unavailable"}
                    aria-label={`Preview ${item.file.name}`}
                    disabled={!isPreviewable(item.file)}
                    onClick={() => setPreview(item)}
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button type="button" title="Replace" aria-label={`Replace ${config.title}`} onClick={() => openPicker()}>
                    <RefreshCw className="h-5 w-5" />
                  </button>
                  <button type="button" title="Remove" aria-label={`Remove ${item.file.name}`} onClick={() => removeFile(item.id)}>
                    <Trash2 className="h-5 w-5" />
                  </button>
                </span>
              </div>
            ))}
          </div>

          <div className="b2-doc-status">
            <span><Check className="h-4 w-4" /> {success || "File validated successfully."}</span>
            {config.multiple ? (
              <button type="button" onClick={() => openPicker("append")}>
                Add Another File
              </button>
            ) : null}
          </div>
        </div>
      )}

      {error ? <p className="b2-doc-error" role="alert">{error}</p> : null}

      {preview ? (
        <div className="b2-doc-preview-backdrop" role="dialog" aria-modal="true" aria-label={`Preview ${preview.file.name}`}>
          <div className="b2-doc-preview-modal">
            <button type="button" className="b2-doc-preview-close" aria-label="Close preview" onClick={() => setPreview(null)}>
              <X className="h-5 w-5" />
            </button>
            <h3 title={preview.file.name}>{truncateFileName(preview.file.name, 48)}</h3>
            {extensionOf(preview.file) === "pdf" ? (
              <iframe src={preview.previewUrl} title={preview.file.name} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.previewUrl} alt={preview.file.name} />
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function QuoteDocumentUpload() {
  return (
    <div className="b2-doc-upload">
      <div className="b2-doc-upload-head">
        <div>
          <h2><Paperclip className="h-6 w-6" /> Attach Documents (Optional)</h2>
          <p>Upload relevant documents to help us validate your requirement before quotation.</p>
        </div>
        <span><Info className="h-5 w-5" /> PDF/DOC/DOCX up to 10 MB; PNG up to 5 MB</span>
      </div>

      <div className="b2-doc-card-grid">
        {uploadConfigs.map((config) => (
          <QuoteUploadCard key={config.name} config={config} />
        ))}
      </div>

      <p className="b2-doc-helper">
        <Info className="h-5 w-5" /> Each file is checked before submission. Images / Other accepts PNG files only.
      </p>
    </div>
  );
}
