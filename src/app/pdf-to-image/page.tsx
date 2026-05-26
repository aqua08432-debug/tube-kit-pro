import { ImageIcon } from "lucide-react";
import PDFConverterTemplate from "@/components/PDFConverterTemplate";

export default function PDFToImagePage() {
    return (
        <PDFConverterTemplate
            title="PDF to Image"
            subtitle="Convert every PDF page into a high-resolution image — PNG, JPG, or TIFF."
            targetFormat="Images (PNG/JPG)"
            targetExt=".zip"
            iconColor="#EC4899"
            icon={<ImageIcon size={20} style={{ color: "#EC4899" }} />}
            conversionOptions={
                <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#606060", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Export Settings</p>
                    <div className="flex flex-col gap-3">
                        <div>
                            <p style={{ fontSize: "12px", color: "#A0A0A0", marginBottom: "6px" }}>Resolution (DPI)</p>
                            <div className="flex gap-2">
                                {["72 DPI", "150 DPI", "300 DPI"].map((d, i) => (
                                    <button key={d} className="pill" style={{ fontSize: "12px", background: i === 1 ? "rgba(255,45,45,0.15)" : undefined, borderColor: i === 1 ? "rgba(255,45,45,0.5)" : undefined, color: i === 1 ? "#FF2D2D" : undefined }}>{d}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p style={{ fontSize: "12px", color: "#A0A0A0", marginBottom: "6px" }}>Format</p>
                            <div className="flex gap-2">
                                {["PNG", "JPG", "TIFF"].map((f, i) => (
                                    <button key={f} className="pill" style={{ fontSize: "12px", background: i === 0 ? "rgba(255,45,45,0.15)" : undefined, borderColor: i === 0 ? "rgba(255,45,45,0.5)" : undefined, color: i === 0 ? "#FF2D2D" : undefined }}>{f}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        />
    );
}
