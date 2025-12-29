/**
 * AI form analysis using Gradio backend
 * Connects to Hugging Face Space for real computer vision analysis
 */

export interface FormAnalysisResult {
  score: number; // 0-100
  sets: number; // Detected number of sets (rep count)
  feedback: string;
  strengths: string[];
  improvements: string[];
}

const SPACE_URL = "https://gibil-pushup-prototype.hf.space";
let gradioClient: any = null;

async function getGradioClient() {
  if (gradioClient) return gradioClient;
  try {
    // Dynamic import for @gradio/client to ensure browser compatibility
    const { Client } = await import('@gradio/client');
    gradioClient = await Client.connect(SPACE_URL);
    return gradioClient;
  } catch (error) {
    console.error('Failed to connect to Gradio backend:', error);
    throw new Error('Unable to connect to AI analysis backend');
  }
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
    const app = await getGradioClient();

    // Call the Gradio named endpoint: "/analyze"
    // Input must be an array because the endpoint takes 1 argument: the video file
    const result = await app.predict("/analyze", [videoBlob]);

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
