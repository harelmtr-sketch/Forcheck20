const GRADIO_API_URL = 'https://tonyhqanguyen-push-up-analyzer.hf.space';

export interface AiDebugState {
  status?: number;
  body?: string;
  videoUri?: string;
  mimeType?: string;
}

let lastDebug: AiDebugState = {};

export function getLastAiDebugState(): AiDebugState {
  return lastDebug;
}

export interface FormAnalysisResult {
  score: number;
  sets: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

function buildFeedback(score: number) {
  if (score >= 90) {
    return 'Explosive power output with excellent eccentric control. Strong time under tension hitting all major muscle groups.';
  }
  if (score >= 75) {
    return 'Solid mechanical advantage maintained. Good muscle activation pattern with steady tempo throughout the set.';
  }
  if (score >= 60) {
    return 'Moderate intensity detected. Work on increasing range of motion and time under tension for better hypertrophy stimulus.';
  }
  if (score >= 40) {
    return 'Limited depth and muscle engagement. Focus on deliberate eccentric lowering and full contraction at peak position.';
  }
  return 'Minimal effective range detected. Prioritize control over speed—slow down the descent and feel the muscle working.';
}

function buildCoaching(score: number) {
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (score >= 70) {
    strengths.push('Maintained stable shoulder position throughout descent');
    strengths.push('Good hip alignment — kept glutes engaged to protect lower back');
    if (score >= 85) {
      strengths.push('Controlled tempo on both eccentric and concentric phases');
    }
  } else {
    improvements.push('Engage your core harder to prevent hip sag');
    improvements.push('Focus on a 2-second descent for better muscle control');
  }

  if (score < 80) {
    improvements.push('Go deeper — chest should nearly touch the ground for full pec activation');
    if (score < 60) {
      improvements.push('Keep elbows at 45° angle, not flared out wide');
    }
  }

  return { strengths, improvements };
}

export async function analyzeWorkoutForm(exerciseName: string, videoUri: string): Promise<FormAnalysisResult> {
  if (!videoUri) {
    throw new Error('Video file is required for analysis');
  }

  const fileName = 'workout.mp4';
  const mimeType = 'video/mp4';
  lastDebug = { videoUri, mimeType };

  const form = new FormData();
  form.append('data', JSON.stringify([null]));
  form.append('video', {
    uri: videoUri,
    name: fileName,
    type: mimeType
  } as any);

  console.log('AI upload request', {
    endpoint: `${GRADIO_API_URL}/api/predict`,
    fields: ['data', 'video'],
    fileName,
    mimeType,
    exerciseName
  });

  const response = await fetch(`${GRADIO_API_URL}/api/predict`, {
    method: 'POST',
    body: form
  });

  if (!response.ok) {
    const body = await response.text();
    console.log('AI upload error response', { status: response.status, body });
    lastDebug = { ...lastDebug, status: response.status, body };
    throw new Error(`Analysis failed (${response.status}): ${body}`);
  }

  const result = await response.json();
  lastDebug = { ...lastDebug, status: response.status, body: JSON.stringify(result).slice(0, 1000) };
  const summary = result?.data?.[0];

  if (!summary || summary.ok === false) {
    const msg = summary?.error || 'Backend returned an error.';
    throw new Error(msg);
  }

  const repCount = Number(summary.rep_count ?? 0);
  let finalScore = 0;

  if (summary.pushup_score != null) {
    finalScore = Number(summary.pushup_score);
  } else if (summary.final_score != null) {
    finalScore = Number(summary.final_score);
  } else {
    const reps = Array.isArray(summary.rep_events) ? summary.rep_events : [];
    if (reps.length) {
      const scores = reps
        .map((r: any) => Number(r.pushup_score))
        .filter((x: number) => Number.isFinite(x));
      finalScore = scores.length
        ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
        : 0;
    }
  }

  const feedback = buildFeedback(finalScore);
  const { strengths, improvements } = buildCoaching(finalScore);

  return {
    score: finalScore,
    sets: repCount,
    feedback,
    strengths,
    improvements
  };
}
