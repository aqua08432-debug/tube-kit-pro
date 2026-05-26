import { BarChart2 } from "lucide-react";
import PDFConverterTemplate from "@/components/PDFConverterTemplate";

export default function PDFToExcelPage() {
    return (
        <PDFConverterTemplate
            title="PDF to Excel"
            subtitle="Extract tables from PDF documents and export them to editable Excel spreadsheets."
            targetFormat="Excel (.xlsx)"
            targetExt=".xlsx"
            iconColor="#22C55E"
            icon={<BarChart2 size={20} style={{ color: "#22C55E" }} />}
            conversionOptions={
                <div>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: "#606060", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Extraction Options</p>
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" defaultChecked style={{ accentColor: "#FF2D2D" }} />
                            <span style={{ fontSize: "13px", color: "#A0A0A0" }}>Extract all tables</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" defaultChecked style={{ accentColor: "#FF2D2D" }} />
                            <span style={{ fontSize: "13px", color: "#A0A0A0" }}>Include column headers</span>
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                            <span style={{ fontSize: "13px", color: "#A0A0A0" }}>Specific pages:</span>
                            <input type="text" placeholder="e.g. 1-3, 5" className="input-field" style={{ fontSize: "13px", padding: "6px 10px", width: "160px" }} />
                        </div>
                    </div>
                </div>
            }
        />
    );
}
