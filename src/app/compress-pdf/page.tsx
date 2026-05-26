import { Minimize2 } from "lucide-react";
import PDFConverterTemplate from "@/components/PDFConverterTemplate";

export default function CompressPDFPage() {
    return (
        <PDFConverterTemplate
            title="Compress PDF"
            subtitle="Reduce PDF file size dramatically without visible quality loss."
            targetFormat="Compressed PDF"
            targetExt=".pdf"
            iconColor="#10B981"
            icon={<Minimize2 size={20} style={{ color: "#10B981" }} />}
            conversionOptions={
                <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#606060", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Compression Level</p>
                    <div className="flex gap-3">
                        {[
                            { label: "Small", desc: "Max compression", sub: "~30% of original" },
                            { label: "Medium", desc: "Balanced", sub: "~55% of original", active: true },
                            { label: "Large", desc: "Best quality", sub: "~80% of original" },
                        ].map((opt) => (
                            <button key={opt.label} className="flex-1 flex flex-col items-center p-3 rounded-xl" style={{ border: `1px solid ${opt.active ? "rgba(255,45,45,0.4)" : "rgba(255,255,255,0.08)"}`, background: opt.active ? "rgba(255,45,45,0.08)" : "rgba(255,255,255,0.02)", cursor: "pointer" }}>
                                <span style={{ fontSize: "14px", fontWeight: 600, color: opt.active ? "#FF2D2D" : "#fff", marginBottom: "2px" }}>{opt.label}</span>
                                <span style={{ fontSize: "12px", color: "#606060" }}>{opt.desc}</span>
                                <span style={{ fontSize: "11px", color: opt.active ? "#FF2D2D" : "#3a3a3a", marginTop: "2px" }}>{opt.sub}</span>
                            </button>
                        ))}
                    </div>
                </div>
            }
        />
    );
}
