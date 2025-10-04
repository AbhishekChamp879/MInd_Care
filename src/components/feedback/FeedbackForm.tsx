import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RatingComponent, QuickSatisfaction } from './RatingComponent';
import {
  SessionFeedback,
  QuickFeedback,
  DetailedFeedback,
  CategoryRatings,
  calculateOverallRating,
} from '@/types/feedback';
import {
  Send,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  User,
  Calendar,
  Timer,
  ThumbsUp,
} from 'lucide-react';

interface FeedbackFormProps {
  sessionId: string;
  studentId: string;
  counselorId: string;
  sessionDate?: string;
  sessionDuration?: number;
  counselorName?: string;
  onSubmit?: (feedback: SessionFeedback) => void;
  onQuickSubmit?: (feedback: QuickFeedback) => void;
  initialData?: Partial<SessionFeedback>;
  isSubmitting?: boolean;
  className?: string;
}

type FormMode = 'quick' | 'detailed';

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  sessionId,
  studentId,
  counselorId,
  sessionDate,
  sessionDuration,
  counselorName,
  onSubmit,
  onQuickSubmit,
  initialData,
  isSubmitting = false,
  className = '',
}) => {
  const [mode, setMode] = useState<FormMode>('quick');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Form state
  const [overallRating, setOverallRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [categoryRatings, setCategoryRatings] = useState<CategoryRatings>({
    helpfulness: 3,
    communication: 3,
    professionalism: 3,
    environment: 3,
    satisfaction: 3,
  });
  const [quickFeedback, setQuickFeedback] = useState<QuickFeedback>({
    wouldRecommend: true,
    feelHeard: true,
    goalsMet: true,
    safeEnvironment: true,
    appropriateLength: true,
  });
  const [detailedFeedback, setDetailedFeedback] = useState<DetailedFeedback>({
    whatWorkedWell: '',
    whatCouldImprove: '',
    additionalComments: '',
    specificConcerns: '',
    suggestions: '',
  });

  const totalSteps = mode === 'quick' ? 3 : 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    if (initialData) {
      if (initialData.overallRating) setOverallRating(initialData.overallRating);
      if (initialData.categoryRatings) setCategoryRatings(initialData.categoryRatings);
      if (initialData.quickFeedback) setQuickFeedback(initialData.quickFeedback);
      if (initialData.detailedFeedback) setDetailedFeedback(initialData.detailedFeedback);
    }
  }, [initialData]);

  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];

    if (currentStep === 0 && !overallRating) {
      errors.push('Overall rating is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuickSubmit = () => {
    if (!overallRating) {
      setValidationErrors(['Overall rating is required']);
      return;
    }

    const quickSubmission: QuickFeedback = {
      wouldRecommend: overallRating >= 4,
      feelHeard: overallRating >= 3,
      goalsMet: overallRating >= 3,
      safeEnvironment: true,
      appropriateLength: true,
    };

    onQuickSubmit?.(quickSubmission);
    setIsSubmitted(true);
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;

    const completeFeedback: SessionFeedback = {
      id: `feedback_${Date.now()}`,
      sessionId,
      studentId,
      counselorId,
      sessionDate: sessionDate || new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      overallRating,
      categoryRatings,
      quickFeedback,
      detailedFeedback,
      anonymous: false,
      isPublic: false,
    };

    onSubmit?.(completeFeedback);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className={`text-center ${className}`}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Thank You!</h3>
              <p className="text-muted-foreground">
                Your feedback has been submitted successfully.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Your feedback helps us improve our services and provide better care.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderQuickMode = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Quick Feedback</h3>
              <p className="text-muted-foreground text-sm">
                Share your overall experience in just a few clicks
              </p>
            </div>

            <RatingComponent
              question="How would you rate your overall experience with this session?"
              value={overallRating}
              onChange={(value) => setOverallRating(value as 1 | 2 | 3 | 4 | 5)}
              disabled={isSubmitting}
              required
              variant="stars"
              showEmoji
              showLabels
              size="lg"
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Quick Questions</h3>
              <p className="text-muted-foreground text-sm">A few quick yes/no questions</p>
            </div>

            <div className="space-y-4">
              <QuickSatisfaction
                question="Would you recommend this counselor to others?"
                onSelect={(satisfaction) => {
                  setQuickFeedback((prev) => ({
                    ...prev,
                    wouldRecommend: satisfaction === 'satisfied',
                  }));
                }}
                value={quickFeedback.wouldRecommend ? 'satisfied' : 'dissatisfied'}
                disabled={isSubmitting}
              />

              <QuickSatisfaction
                question="Did you feel heard and understood?"
                onSelect={(satisfaction) => {
                  setQuickFeedback((prev) => ({
                    ...prev,
                    feelHeard: satisfaction === 'satisfied',
                  }));
                }}
                value={quickFeedback.feelHeard ? 'satisfied' : 'dissatisfied'}
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Additional Comments</h3>
              <p className="text-muted-foreground text-sm">
                Share any additional thoughts (optional)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional comments (optional)</label>
              <Textarea
                placeholder="Share any additional thoughts about your session..."
                value={detailedFeedback.additionalComments || ''}
                onChange={(e) =>
                  setDetailedFeedback((prev) => ({
                    ...prev,
                    additionalComments: e.target.value,
                  }))
                }
                disabled={isSubmitting}
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDetailedMode = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Overall Experience</h3>
              <p className="text-muted-foreground text-sm">Rate your overall session experience</p>
            </div>

            <RatingComponent
              question="How would you rate your overall experience?"
              value={overallRating}
              onChange={(value) => setOverallRating(value as 1 | 2 | 3 | 4 | 5)}
              disabled={isSubmitting}
              required
              variant="stars"
              showEmoji
              showLabels
              size="lg"
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Counselor Performance</h3>
              <p className="text-muted-foreground text-sm">
                Rate different aspects of your counselor's performance
              </p>
            </div>

            <div className="space-y-6">
              <RatingComponent
                question="How helpful was your counselor?"
                value={categoryRatings.helpfulness}
                onChange={(value) =>
                  setCategoryRatings((prev) => ({
                    ...prev,
                    helpfulness: value as 1 | 2 | 3 | 4 | 5,
                  }))
                }
                disabled={isSubmitting}
                variant="stars"
                showLabels
              />

              <RatingComponent
                question="How clear was the communication?"
                value={categoryRatings.communication}
                onChange={(value) =>
                  setCategoryRatings((prev) => ({
                    ...prev,
                    communication: value as 1 | 2 | 3 | 4 | 5,
                  }))
                }
                disabled={isSubmitting}
                variant="stars"
                showLabels
              />

              <RatingComponent
                question="How professional was your counselor?"
                value={categoryRatings.professionalism}
                onChange={(value) =>
                  setCategoryRatings((prev) => ({
                    ...prev,
                    professionalism: value as 1 | 2 | 3 | 4 | 5,
                  }))
                }
                disabled={isSubmitting}
                variant="stars"
                showLabels
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Session Environment</h3>
              <p className="text-muted-foreground text-sm">
                Rate the session environment and your satisfaction
              </p>
            </div>

            <div className="space-y-6">
              <RatingComponent
                question="How comfortable was the session environment?"
                value={categoryRatings.environment}
                onChange={(value) =>
                  setCategoryRatings((prev) => ({
                    ...prev,
                    environment: value as 1 | 2 | 3 | 4 | 5,
                  }))
                }
                disabled={isSubmitting}
                variant="stars"
                showLabels
              />

              <RatingComponent
                question="How satisfied are you with the session outcomes?"
                value={categoryRatings.satisfaction}
                onChange={(value) =>
                  setCategoryRatings((prev) => ({
                    ...prev,
                    satisfaction: value as 1 | 2 | 3 | 4 | 5,
                  }))
                }
                disabled={isSubmitting}
                variant="stars"
                showLabels
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Quick Assessment</h3>
              <p className="text-muted-foreground text-sm">A few quick yes/no questions</p>
            </div>

            <div className="space-y-4">
              <QuickSatisfaction
                question="Would you recommend this counselor?"
                onSelect={(satisfaction) => {
                  setQuickFeedback((prev) => ({
                    ...prev,
                    wouldRecommend: satisfaction === 'satisfied',
                  }));
                }}
                value={quickFeedback.wouldRecommend ? 'satisfied' : 'dissatisfied'}
                disabled={isSubmitting}
              />

              <QuickSatisfaction
                question="Were your session goals met?"
                onSelect={(satisfaction) => {
                  setQuickFeedback((prev) => ({
                    ...prev,
                    goalsMet: satisfaction === 'satisfied',
                  }));
                }}
                value={quickFeedback.goalsMet ? 'satisfied' : 'dissatisfied'}
                disabled={isSubmitting}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Detailed Comments</h3>
              <p className="text-muted-foreground text-sm">
                Share your detailed thoughts and suggestions
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">What worked well?</label>
                <Textarea
                  placeholder="Tell us what you found most helpful..."
                  value={detailedFeedback.whatWorkedWell || ''}
                  onChange={(e) =>
                    setDetailedFeedback((prev) => ({
                      ...prev,
                      whatWorkedWell: e.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">What could be improved?</label>
                <Textarea
                  placeholder="Share suggestions for improvement..."
                  value={detailedFeedback.whatCouldImprove || ''}
                  onChange={(e) =>
                    setDetailedFeedback((prev) => ({
                      ...prev,
                      whatCouldImprove: e.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional comments</label>
                <Textarea
                  placeholder="Any other thoughts you'd like to share..."
                  value={detailedFeedback.additionalComments || ''}
                  onChange={(e) =>
                    setDetailedFeedback((prev) => ({
                      ...prev,
                      additionalComments: e.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Session Feedback</span>
            </CardTitle>
            <CardDescription className="flex items-center space-x-4 mt-2">
              {counselorName && (
                <span className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{counselorName}</span>
                </span>
              )}
              {sessionDate && (
                <span className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(sessionDate).toLocaleDateString()}</span>
                </span>
              )}
              {sessionDuration && (
                <span className="flex items-center space-x-1">
                  <Timer className="h-3 w-3" />
                  <span>{sessionDuration} min</span>
                </span>
              )}
            </CardDescription>
          </div>

          <div className="flex space-x-2">
            <Button
              variant={mode === 'quick' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMode('quick');
                setCurrentStep(0);
              }}
              disabled={isSubmitting}
            >
              Quick
            </Button>
            <Button
              variant={mode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMode('detailed');
                setCurrentStep(0);
              }}
              disabled={isSubmitting}
            >
              Detailed
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {mode === 'quick' ? renderQuickMode() : renderDetailedMode()}

        <Separator />

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isSubmitting}
          >
            Previous
          </Button>

          <div className="flex space-x-2">
            {mode === 'quick' && currentStep === 0 && (
              <Button
                onClick={handleQuickSubmit}
                disabled={!overallRating || isSubmitting}
                className="flex items-center space-x-2"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Quick Submit</span>
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Feedback</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <TrendingUp className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
