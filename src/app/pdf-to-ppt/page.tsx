import { Monitor } from "lucide-react";
import PDFConverterTemplate from "@/components/PDFConverterTemplate";

export default function PDFToPPTPage() {
    return (
        <PDFConverterTemplate
            title="PDF to PowerPoint"
            subtitle="Convert PDF slides to editable PowerPoint presentations with layout preserved."
            targetFormat="PowerPoint (.pptx)"
            targetExt=".pptx"
            iconColor="#FF6B35"
            icon={<Monitor size={20} style={{ color: "#FF6B35" }} />}
            conversionOptions={
                <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#606060", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Conversion Mode</p>
                    <div className="flex flex-col gap-2">
                        {["Each PDF page becomes a slide", "Smart layout detection", "Group content into sections"].map((opt, i) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="ppt-mode" defaultChecked={i === 0} style={{ accentColor: "#FF2D2D" }} />
                                <span style={{ fontSize: "13px", color: "#A0A0A0" }}>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            }
        />
    );
}
