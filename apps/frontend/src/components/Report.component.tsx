import React, { useEffect, useState } from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { CoachingSession, CoachingStyle, CoachingStyleTimechartData, StyleFeedback } from "../models/coaching-session/coaching-session.model";
import { coachingService } from "../services/report.service";
import { message } from "antd";
import ImdLogo from '../assets/Imd-Logo.png';
import styles from "./ReportDocument.styles";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  PieController,
  LineController,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(ArcElement, LineElement, PointElement, Tooltip, Legend, PieController, LineController, CategoryScale, LinearScale);


const ReportDocument: React.FC<{coachingSession: CoachingSession, loading: boolean}> = ({ coachingSession, loading }) => {
  
  const [roundFeedback, setRoundFeedback] = useState<String>("");
  const [styleFeedback, setStyleFeedback] = useState<StyleFeedback[]>([]);
  const [styleStats, setStyleStats] = useState<CoachingStyle[]>([]);
  const [styleTimechart, setStyleTimechart] = useState<CoachingStyleTimechartData[]>([]);
  const [Loading, setLoading] = useState<boolean>(false);

  const [pieChartImage, setPieChartImage] = useState<string | null>(null);
  const [lineChartImage, setLineChartImage] = useState<string | null>(null);

  const generatePieChartImage = async () => {
   
    if (!styleStats || styleStats.length === 0) {
      return;
    }

    const labels = styleStats.map((item) => {
      return item.name;
    });

    const dataValues = styleStats.map((item) => {
      return item.value;
    });

    const canvas = new OffscreenCanvas(600, 400);
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    new ChartJS(context as any, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            label: "Coaching Styles",
            data: dataValues,
            backgroundColor: [
              "#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c",
            ],
            borderWidth: 1,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: false,
        animation: false,
        layout: { padding: { bottom: 40 } },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            align: "center",
            labels: { boxWidth: 15, padding: 15, font: { size: 12 } },
          },
        },
      },
    });

    const blob = await canvas.convertToBlob();
    const dataURL = await convertBlobToDataURL(blob);
    setPieChartImage(dataURL);
  };
  
  const generateLineChartImage = async (styleTimechart: CoachingStyleTimechartData[]) => {
    console.log("Generating line chart...");

    if (!styleTimechart || styleTimechart.length === 0) {
      console.error("No data available for chart.");
      return;
    }

    const canvas = new OffscreenCanvas(600, 400);
    const context = canvas.getContext("2d");

    if (!context) {
      console.error("Failed to get canvas rendering context");
      return;
    }

    // Dynamically extract labels and data from `styleTimechart`
    //@ts-ignore
    const labels = styleTimechart.map((entry) => entry.ax.toString()); // X-axis labels (time in minutes)
    //@ts-ignore
    const dataValues = styleTimechart.map((entry) => entry.ay); // Y-axis values (coaching styles)

    // Define y-axis mapping
    const yAxisMapping = {
      10: "Supportive",
      20: "Informative",
      30: "Catalytic",
      40: "Prescriptive",
      50: "Challenging",
      60: "Cathartic",
    };

    // Create the chart
    new ChartJS(context as any, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Time (Mins.)",
            data: dataValues,
            borderColor: "#36A2EB",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: false,
        animation: false,
        elements: {
          line: {
            stepped: "before",
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                //@ts-ignore
                return yAxisMapping[value] || ""; // Show mapped coaching styles
              },
              stepSize: 10,
              autoSkip: false,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Coaching Style Over Time",
          },
        },
      },
    });

    // ✅ Ensure `convertBlobToDataURL` is defined
    const convertBlobToDataURL = (blob: Blob): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    };

    const blob = await canvas.convertToBlob();
    const dataURL = await convertBlobToDataURL(blob);
    setLineChartImage(dataURL);
  };

  const convertBlobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => resolve(e.target?.result as string);
      fileReader.readAsDataURL(blob);
    });
  };
 
  const roundId = coachingSession.coaching_round_id;

  const fetchReportData = async () => {
    try {
      setLoading(true);

      if (!roundId) {
        message.error("Coaching round ID is missing.");
        return;
      }

      const [feedbackRes, styleStatsRes, styleTimechartRes] = await Promise.all([
        coachingService.fetchFeedback({ roundId }),                  // 1. Feedback
        coachingService.getCoachingStyleStats({ coachingRoundId: roundId }), // 2. Style Stats
        coachingService.getCoachingStyleTimechart({ roundId }),              // 3. Timechart
      ]);

      // 1. Feedback
      if (feedbackRes.success && feedbackRes.data) {
        const feedback = feedbackRes.data.roundFeedback[0]?.feedback_improvements;
        setRoundFeedback(feedback || "");
        setStyleFeedback(feedbackRes.data.styleFeedback || []);
      }

      // 2. Style Stats
      if (styleStatsRes.success && styleStatsRes.data) {
        const transformedData = transformPieChartData(styleStatsRes.data);
        setStyleStats(transformedData);
      }

      // 3. Style Timechart
      if (styleTimechartRes.success && styleTimechartRes.data) {
        const transformedData = transformStyleChartData(styleTimechartRes.data);
        setStyleTimechart(transformedData);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to fetch report data.");
    } finally {
      setLoading(false);
    }
  };

 const transformStyleChartData = (data: any[]) => {
  const coachingStyleMapping: { [key: string]: number } = {
    Supportive: 10,
    Informative: 20,
    Catalytic: 30,
    Prescriptive: 40,
    Challenging: 50,
    Cathartic: 60
  };

  const transformedData: any[] = data.map((item) => {
    const coachingStyle = item.coaching_style?.trim(); // Ensure no leading/trailing spaces
    const ayValue = coachingStyleMapping[coachingStyle]; // Map the value

    if (ayValue === undefined) {
      console.warn(`Undefined coaching style: ${coachingStyle}`); // Debugging
    }

    return {
      ax: item.section, // Keeping 'ax' as section
      ay: ayValue ?? null, // If mapping fails, use null instead of undefined
      alias: coachingStyle || "Unknown" // Avoid undefined alias
    };
  });

  return transformedData;
  };

  const transformPieChartData = (resultround: any[]) => {
     
      if (!resultround || resultround.length === 0) {
          return [];
      }

      // @ts-ignore: Suppressing TypeScript warning
      let roundSeries = [];

      resultround.forEach((round, index) => {
        
          if (round.rows.length > 0) {
              
              // @ts-ignore: Suppressing TypeScript warning
              roundSeries = round.rows.map((style: { coaching_style: string; percentage: number }) => {
                  
                  return {
                      name: style.coaching_style,
                      value: parseFloat((style.percentage * 100).toFixed(2))
                  };
              });
          }
      });

      if (roundSeries.length === 0) {
          console.warn("No valid data found in any round.");
      }
  
    // @ts-ignore: Suppressing TypeScript warning
      return roundSeries;
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  useEffect(() => {
    if (styleStats.length > 0) {
      generatePieChartImage();
    }
  }, [styleStats]);

  useEffect(() => {
    if (styleTimechart.length > 0) {
      generateLineChartImage(styleTimechart);
    }
  }, [styleTimechart]);

  if (loading) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.loadingText}>Generating report, please wait...</Text>
        </Page>
      </Document>
    );
  }


  return (

    <Document>
      {/* Page 1: Overall Intervention Analysis */}
      <Page size="A4" style={styles.page}>
        <Image src={ImdLogo} style={styles.logo} />
        <Text style={styles.title}>OVERALL INTERVENTION ANALYSIS</Text>

        {/* Details Section */}
        <View style={styles.detailsCard}>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailsColumn}>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsKey}>Team:</Text>
                <Text style={styles.detailsValue}>{coachingSession.coaching_session_name }</Text>
              </View>
            </View>
            <View style={styles.detailsColumn}>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsKey}>Coach:</Text>
                <Text style={styles.detailsValue}>{coachingSession.coachee_name }</Text>
              </View>
            </View>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.detailsColumn}>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsKey}>Date:</Text>
                <Text style={styles.detailsValue}> {coachingSession.date 
                  ? new Intl.DateTimeFormat("en-US", { 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    }).format(new Date(coachingSession.date)) 
                  : "N/A"
                }</Text>
              </View>
            </View>
            <View style={styles.detailsColumn}>
              <View style={styles.detailsItem}>
                <Text style={styles.detailsKey}>Round:</Text>
                <Text style={styles.detailsValue}>{coachingSession.round }</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pie Chart Analysis */}
        <View>
          <Text style={styles.sectionTitle}>Coaching Style Distribution</Text>
          {pieChartImage && <Image src={pieChartImage} style={styles.chart} />}
        </View>
      </Page>

      {/* Page 2: Performance and Round Feedback */}
      <Page size="A4" style={styles.page}>
        <Image src={ImdLogo} style={styles.logo} />
        <Text style={styles.title}>OVERALL INTERVENTION ANALYSIS</Text>
        <View>
          <Text style={styles.sectionTitle}>Performance Trends</Text>
          {lineChartImage && <Image src={lineChartImage} style={styles.linechart} />}
        </View>
        <View>
          <Text style={styles.sectionTitle}>Round-Specific Feedback</Text>
          <Text style={styles.roundfeedbackText}>{roundFeedback}</Text>
        </View>
      </Page>

      {/* Page 3: Detailed Intervention Analysis */}
      <Page size="A4" style={styles.page}>
        <Image src={ImdLogo} style={styles.logo} />
        <Text style={styles.title}>DETAILED INTERVENTION ANALYSIS</Text>
        <Text style={styles.sectionTitle}>Coaching Style Feedback</Text>
        <View>
          {styleFeedback.map((item, index) => (
            <View key={index} style={[styles.feedbackContainer, index % 2 === 0 ? styles.greyBackground : styles.whiteBackground]}>
              <Text style={styles.feedbackTitle}>{index + 1}. {item.coaching_style}:</Text>
              <Text style={styles.feedbackText}>{item.style_explanation}</Text>
            </View>
          ))}
        </View>
      </Page>

      
    </Document>

  )
};

export default ReportDocument;
