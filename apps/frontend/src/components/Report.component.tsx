import React, { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { CoachingStyle, CoachingStyleTimechartData, RoundFeedback, StyleFeedback, TranscriptionData } from "../models/coaching-session/coaching-session.model";
import { coachingService } from "../services/report.service";
import { message } from "antd";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  RadarController // Register the Radar controller
);

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 5,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  chart: {
    marginTop: 20,
    width: "100%",
    height: 200,
  },
});

const dummyData = [
  {
    title: "Overall Intervention Analysis",
    additionalContent: `
      Range of Coaching Styles Used
      
      Catalytic
      Informative
      Supportive
      Cathartic
      Challenging
      Prescriptive
      
      After reviewing your coaching session with Tania, it’s clear that you have a strong grasp of several effective coaching techniques, which you utilized to facilitate meaningful dialogue and reflection. Your application of the Catalytic and Informative styles was particularly effective, helping Tania to explore the situation from multiple perspectives and to deepen her understanding of the dynamics at play. You skillfully prompted her to consider how her counterpart might be viewing the situation, which is crucial for developing empathy and devising more effective strategies.
      
      However, there are opportunities to enhance your coaching by incorporating elements of other coaching styles like Supportive and Challenging styles. A more pronounced supportive approach could help reinforce Tania’s confidence and validate her efforts, which seem to be waning due to the ongoing challenges. Additionally, employing the challenging style could provoke critical reflection on Tania’s assumptions and perceived lack of options, potentially opening new avenues for action that she had not considered.
      
      While your approach facilitated a comprehensive exploration of the issues, further emphasis on emotional support (Cathartic style) and challenge could enhance the resilience and creativity of your coachees in facing complex interpersonal dilemmas. Engaging more deeply on an emotional level and pushing for reconsideration of fixed viewpoints could make your sessions even more impactful.
      
      Overall, your coaching technique shows a commendable level of sensitivity and adaptiveness to the needs of your coachee, and with continued practice and integration of a broader range of interventions, you are well-positioned to further enhance your effectiveness as a coach. Keep up the great work!
    `,
  },
  {
    title: "Detailed Intervention Analysis - 1",
    additionalContent: `
      Here's a comprehensive summary feedback touching on all six Heron coaching styles observed during the coaching session:
      
      1. Prescriptive: This style was underused. Given Tania’s feeling of being at an impasse, direct suggestions or specific strategies, such as methods for initiating a reset or handling adversarial dynamics, could provide Tania with clear steps and support in decision-making, especially useful when she feels stuck or overwhelmed.
      2. Informative: You effectively utilized this style to extract and clarify details of the situation. Continuing to provide relevant information or introducing new knowledge, such as examples of successful relationship resets in similar professional settings, would further empower Tania in her decision-making processes.
      3. Challenging: There's an opportunity to enhance the use of this style by more directly questioning Tania’s assumptions and perceived constraints. Encouraging her to explore alternative perspectives or to critically assess the feasibility of the "nuclear option" her colleague suggested could uncover hidden solutions and stimulate proactive changes.
      4. Cathartic: Increasing the use of this style could help Tania express and process the emotional aspects of her challenges, potentially uncovering deeper personal insights and relieving stress, which would promote clearer thinking. Given the emotional charge of her situation, this could be particularly beneficial.
      5. Catalytic: You effectively employed this style to encourage self-discovery and problem-solving. Further focus here could lead to more significant breakthroughs in Tania’s understanding and actions, especially around her interpretations of the adversarial dynamics and her team’s reactions.
      6. Supportive: While general support was evident, a more focused application of this style could involve validating Tania's efforts and emotions, thereby enhancing her confidence and resilience in dealing with the situation. Recognizing her attempts to improve the relationship and affirming the difficulty of navigating such complex interpersonal dynamics would bolster her morale and persistence.
    `,
  },
  {
    title: "Detailed Intervention Analysis - 2",
    additionalContent: `
      Here's a comprehensive summary feedback touching on all six Heron coaching styles observed during the coaching session:
      
      1. Prescriptive: This style was underused. For instance, when Tania mentioned feeling stuck between resetting relationships and adopting a 'nuclear' strategy, you could have offered more concrete advice or strategies for conflict resolution, such as suggesting specific communication techniques or structured negotiation approaches.
      2. Informative: You demonstrated this style when you prompted Tania to elaborate on when the relationship issues began, which helped clarify the timeline and contributing factors. Further information could have been provided on similar cases or strategies that proved successful in similar situations.
      3. Challenging: This style was lightly used but could have been more pronounced. For instance, when Tania discussed the 'nuclear option', you could have challenged her by asking, "What are the potential long-term consequences of choosing this option over trying to repair the relationship?" This could help her weigh her options more critically.
      4. Cathartic: There was a missed opportunity for this style when Tania mentioned feeling out of options. Prompting her to express more about her feelings, such as, "It sounds like this situation is really weighing on you; what emotions are you feeling the most right now?" could have provided emotional release and clearer thinking. Given the emotional charge of her situation, this could be particularly beneficial.
      5. Catalytic: You used this style effectively by asking Tania to consider her counterpart’s perspective. Another catalytic question could have been, "What do you think are his biggest fears regarding your team’s approach?" to help her uncover deeper insights into his defensive behaviors.
      6. Supportive: General support was evident, but more explicit validation could strengthen this style. Saying something like, "You've been very resilient in navigating these challenges; it's clear you care deeply about finding a solution," would affirm her efforts and bolster her confidence. Recognizing her attempts to improve the relationship and affirming the difficulty of navigating such complex interpersonal dynamics would bolster her morale and persistence.
    `,
  },
];


interface ReportDocumentProps {
  coaching_round_id: string;
}


const ReportDocument: React.FC<ReportDocumentProps> = ({ coaching_round_id }) => {
  
  const [roundFeedback, setRoundFeedback] = useState<RoundFeedback[]>([]);
  const [styleFeedback, setStyleFeedback] = useState<StyleFeedback[]>([]);
  const [styleStats, setStyleStats] = useState<CoachingStyle[][]>([]);
  const [styleTimechart, setStyleTimechart] = useState<CoachingStyleTimechartData[]>([]);
  const [transcriptions, setTranscriptions] = useState<TranscriptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [chartImage, setChartImage] = useState<string | null>(null);

  useEffect(() => {
    const generateChartImage = async () => {
      const canvas = new OffscreenCanvas(600, 400);
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Failed to get canvas rendering context");
        return;
      }

      // Cast the context to CanvasRenderingContext2D
      const castedContext = context as unknown as CanvasRenderingContext2D;

      const chart = new ChartJS(castedContext, {
        type: "radar", // Radar chart
        data: {
          labels: ["Catalytic", "Informative", "Supportive", "Cathartic", "Challenging", "Prescriptive"],
          datasets: [
            {
              label: "Coaching Styles",
              data: [40, 30, 20, 10, 15, 5],
              backgroundColor: "rgba(84,112,221,0.4)",
              borderColor: "rgb(84,112,221)",
            },
          ],
        },
        options: {
          responsive: false,
          animation: false, // Disable animations
        },
      });

      const blob = await canvas.convertToBlob();
      const dataURL = await new Promise<string>((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => resolve(e.target?.result as string);
        fileReader.readAsDataURL(blob);
      });

      setChartImage(dataURL);
    };

    generateChartImage();
  }, []);

  // Example roundId for demonstration
 
  const roundId = coaching_round_id;
  const coachingSessionName = "IMD12%20-%20Group%2012"

  // Fetch all the data in parallel using Promise.all
  const fetchReportData = async () => {
    try {
      setLoading(true);

      if (!coaching_round_id) {
        message.error("Coaching round ID is missing.");
        return;
      }

      const [
        feedbackRes,
        styleStatsRes,
        styleTimechartRes,
        transcriptionsRes,
      ] = await Promise.all([
        coachingService.fetchFeedback({ roundId }),                  // 1. Feedback
        coachingService.getCoachingStyleStats({ coachingRoundId: roundId }), // 2. Style Stats
        coachingService.getCoachingStyleTimechart({ roundId }),              // 3. Timechart
        coachingService.getTranscriptions({ coachingSessionName: coachingSessionName }), // 4. Transcriptions
      ]);

      // 1. Feedback
      if (feedbackRes.success && feedbackRes.data) {
        setRoundFeedback(feedbackRes.data.roundFeedback || []);
        setStyleFeedback(feedbackRes.data.styleFeedback || []);
      }

      // 2. Style Stats
      if (styleStatsRes.success && styleStatsRes.data) {
        setStyleStats(styleStatsRes.data);
      }

      // 3. Style Timechart
      if (styleTimechartRes.success && styleTimechartRes.data) {
        setStyleTimechart(styleTimechartRes.data);
      }

      // 4. Transcriptions
      if (transcriptionsRes.success && transcriptionsRes.data) {
        setTranscriptions(transcriptionsRes.data);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to fetch report data.");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchReportData when component mounts
  useEffect(() => {
    fetchReportData();
  }, []);


  return (
    <Document>
    {dummyData.map((pageData, index) => (
      <Page size="A4" style={styles.page} key={index}>
        <View style={styles.section}>
          <Text style={styles.header}>{pageData.title}</Text>
          <Text style={styles.text}>{pageData.additionalContent}</Text>
        </View>

        {/* Render the generated chart image */}
        {chartImage && (
          <View style={styles.section}>
            <Image src={chartImage} style={styles.chart} />
          </View>
        )}
      </Page>
    ))}
  </Document>
  )
};

export default ReportDocument;
