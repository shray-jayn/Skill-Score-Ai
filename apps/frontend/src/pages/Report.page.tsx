import React, { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import ReportDocument from "../components/Report.component";
import MainLayout from "../layouts/main.layout";
import { FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";
import { useLocation, useParams } from "react-router-dom";
import { TranscriptionData } from "../models/coaching-session/coaching-session.model";
import { message } from "antd";
import { coachingService } from "../services/report.service";
import * as XLSX from "xlsx";

const ReportPage: React.FC = () => {
  const { coaching_round_id } = useParams<{ coaching_round_id?: string }>();
  const location = useLocation();
  const coachingSessionName = location.state?.coachingSessionName || "Unknown Session";

  const [transcriptions, setTranscriptions] = useState<TranscriptionData[]>([]);

  // Function to fetch transcriptions
  const fetchTranscriptions = async () => {
    try {
      const transcriptionsRes = await coachingService.getTranscriptions({
        coachingSessionName: coachingSessionName,
      });
      if (transcriptionsRes.success && transcriptionsRes.data) {
        setTranscriptions(transcriptionsRes.data);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to fetch Transcriptions");
    }
  };

  // Function to export data as Excel
  const exportAsExcel = () => {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(transcriptions, {
      header: ["speaker_id", "transcribed_text"],
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ["data"],
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAsExcelFile(excelBuffer, coachingSessionName);
  };

  const saveAsExcelFile = (buffer: any, fileName: string): void => {
    const data: Blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = window.URL.createObjectURL(data);
    link.download = `${fileName}_export_${new Date().getTime()}.xlsx`;
    link.click();
  };

  useEffect(() => {
    fetchTranscriptions();
  }, []);

  if (!coaching_round_id) {
    return <div>Error: Coaching Round ID is missing in the URL.</div>;
  }

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center bg-gray-100 min-h-[calc(100vh-64px)] p-4">
        {/* Header Section */}
        <div className="flex items-center justify-between w-full max-w-5xl mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">{coachingSessionName}</h1>
          <div className="flex space-x-4">
            {/* Download Excel Button */}
            <button
              onClick={exportAsExcel}
              className="relative group text-gray-500 hover:text-gray-700 text-4xl"
            >
              <FileExcelOutlined />
              <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 shadow-lg">
                Download Excel
              </span>
            </button>
            {/* Download PDF Button */}
            <PDFDownloadLink
              document={<ReportDocument coaching_round_id={coaching_round_id} />}
              fileName="Coaching_Report.pdf"
              className="relative group text-gray-500 hover:text-gray-700 text-4xl"
            >
              <FilePdfOutlined />
              <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 shadow-lg">
                Download PDF
              </span>
            </PDFDownloadLink>
          </div>
        </div>
        {/* PDF Viewer */}
        <div className="w-full max-w-5xl h-[75vh] bg-white shadow-lg rounded-lg overflow-hidden">
          <PDFViewer className="w-full h-full">
            <ReportDocument coaching_round_id={coaching_round_id || ""} />
          </PDFViewer>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReportPage;
