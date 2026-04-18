import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onClear?: () => void;
  folder?: string;
  aspectRatio?: "square" | "landscape";
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  onClear,
  folder = "crops",
  aspectRatio = "landscape",
  label = "Upload Image",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Image must be under 10 MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const authRes = await fetch("/api/upload/auth", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!authRes.ok) throw new Error("Failed to get upload credentials");
      const { signature, expire, token: ikToken, publicKey } = await authRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", `${folder}-${Date.now()}-${file.name.replace(/\s+/g, "_")}`);
      formData.append("folder", `/${folder}`);
      formData.append("publicKey", publicKey);
      formData.append("signature", signature);
      formData.append("expire", String(expire));
      formData.append("token", ikToken);

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const data = await uploadRes.json();
      onChange(data.url);
      toast({ title: "Image uploaded", description: "Your image was uploaded successfully." });
    } catch (err) {
      toast({ title: "Upload failed", description: "Could not upload image. Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const containerClass =
    aspectRatio === "square"
      ? "w-32 h-32 rounded-full overflow-hidden"
      : "w-full rounded-xl overflow-hidden aspect-[4/3]";

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group">
          <div className={containerClass + " border border-border shadow-sm bg-muted"}>
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          </div>
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${aspectRatio === "square" ? "rounded-full" : "rounded-xl"}`}>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              Change
            </Button>
            {onClear && (
              <Button type="button" size="sm" variant="destructive" onClick={onClear}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`${containerClass} border-2 border-dashed border-border bg-muted/40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/60 transition-colors`}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading…</p>
            </>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">Click to browse — JPG, PNG up to 10 MB</p>
            </>
          )}
        </div>
      )}
      {!value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading…</>
          ) : (
            <><Upload className="mr-2 h-4 w-4" /> {label}</>
          )}
        </Button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
