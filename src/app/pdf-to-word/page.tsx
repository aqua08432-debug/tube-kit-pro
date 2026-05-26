import { FileEdit } from "lucide-react";
import PDFConverterTemplate from "@/components/PDFConverterTemplate";

export default function PDFToWordPage() {
    return (
        <PDFConverterTemplate
            title="PDF to Word"
            subtitle="Convert PDF files to editable Word documents with perfect formatting preserved."
            targetFormat="Word (.docx)"
            targetExt=".docx"
            iconColor="#3B82F6"
            icon={<FileEdit size={20} style={{ color: "#3B82F6" }} />}
            conversionOptions={
                <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#606060", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Conversion Options</p>
                    <div className="flex flex-col gap-2">
                        {["Preserve layout and formatting", "Extract text only (plain)", "OCR mode (scanned PDFs)"].map((opt, i) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="word-mode" defaultChecked={i === 0} style={{ accentColor: "#FF2D2D" }} />
                                <span style={{ fontSize: "13px", color: "#A0A0A0" }}>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            }
        />
    );
}
