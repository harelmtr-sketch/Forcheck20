import { Client } from "@gradio/client";

/**
 * Result of AI form analysis
 */
export interface FormAnalysisResult {
  score: number;        // 0-100
  sets: number;         // detected rep count
  feedback: string;
  strengths: string[];
  improvements: string[];
}

/**
 * Gradio API endpoint for AI analysis
 */
const GRADIO_API_URL = "https://tonyhqanguyen-push-up-analyzer.hf.space";

/**
 * Get or create Gradio client instance with timeout
 */
async function getGradioClient() {
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Connection timeout. Unable to reach analysis server.')), 30000)
  );
  
  const clientPromise = Client.connect(GRADIO_API_URL);
  
  const client = await Promise.race([clientPromise, timeoutPromise]) as Client;
  return client;
}

/**
 * Analyze workout form using real AI backend
 * Sends video to Gradio API and returns analysis results
 */
export async function analyzeWorkoutForm(exerciseName: string, videoBlob?: Blob): Promise<FormAnalysisResult> {
  if (!videoBlob) {
    throw new Error('Video file is required for analysis');
  }

  try {
    console.log('Starting AI analysis for:', exerciseName, 'Video size:', videoBlob.size, 'bytes');
    const app = await getGradioClient();
    console.log('Gradio client connected, sending video...');

    // Add timeout for the prediction call (2 minutes for video processing)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Analysis timeout after 2 minutes. Please try with a shorter video (10-15 seconds recommended).')), 120000)
    );

    // Call the Gradio named endpoint: "/analyze"
    // Input must be an array because the endpoint takes 1 argument: the video file
    const result = await Promise.race([
      app.predict("/analyze", [videoBlob]),
      timeoutPromise
    ]) as any;

    console.log('Received analysis result:', result);

    // Gradio returns: { data: [output1, output2, ...] }
    const summary = result?.data?.[0];        // JSON summary
    // const annotated = result?.data?.[1];   // annotated video (optional, not used here)

    if (!summary || summary.ok === false) {
      const msg = summary?.error || "Backend returned an error.";
      throw new Error(msg);
    }

    // Extract rep count
    const repCount = Number(summary.rep_count ?? 0);

    // Final score logic (defensive)
    let finalScore: number = 0;

    // If backend already provides final score directly:
    if (summary.pushup_score != null) {
      finalScore = Number(summary.pushup_score);
    } else if (summary.final_score != null) {
      finalScore = Number(summary.final_score);
    } else {
      // Otherwise compute average of rep_events[*].pushup_score
      const reps = Array.isArray(summary.rep_events) ? summary.rep_events : [];
      if (reps.length === 0) {
        finalScore = 0;
      } else {
        const scores = reps
          .map((r: any) => Number(r.pushup_score))
          .filter((x: number) => Number.isFinite(x));
        finalScore = scores.length ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
      }
    }

    // Generate feedback based on score
    let feedback = '';
    if (finalScore >= 90) {
      feedback = 'Excellent form! Your technique is outstanding.';
    } else if (finalScore >= 75) {
      feedback = 'Great form! Minor adjustments could help.';
    } else if (finalScore >= 60) {
      feedback = 'Good effort! Focus on form improvements.';
    } else if (finalScore >= 40) {
      feedback = 'Decent attempt! More practice needed.';
    } else {
      feedback = 'Form needs work! Focus on the basics.';
    }

    // Generate strengths and improvements based on score
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (finalScore >= 70) {
      strengths.push('Controlled movement');
      strengths.push('Good range of motion');
      if (finalScore >= 85) {
        strengths.push('Excellent form consistency');
      }
    } else {
      improvements.push('Work on form consistency');
      improvements.push('Control the movement');
    }

    if (finalScore < 80) {
      improvements.push('Increase range of motion');
      if (finalScore < 60) {
        improvements.push('Focus on proper technique');
      }
    }

    return {
      score: finalScore,
      sets: repCount,
      feedback,
      strengths,
      improvements,
    };
  } catch (error: any) {
    console.error('AI analysis error:', error);
    throw new Error(error?.message || 'Failed to analyze video. Please try again.');
  }
}