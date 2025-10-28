import { useState } from 'react';
import { Send, MessageSquare, Loader2, CheckCircle, AlertCircle, Search, User, Brain, Sparkles, History, Settings } from 'lucide-react';
import './App.css';

// Custom hooks and utilities
import { useResearch } from './hooks/useResearch';
import { getCharacterCount, truncateText } from './utils/helpers';

// Modern UI Components
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Separator } from './components/ui/separator';

// Components
import ChatContainer from './components/chat/ChatContainer';
import UserSettings from './components/sidebar/UserSettings';
import SessionList from './components/sidebar/SessionList';

/**
 * Main Application Component - Modern AI Research Orchestrator
 * Enhanced with shadcn/ui components and elegant spacing
 */
function App() {
  const {
    userId,
    history,
    selectedSession,
    selectedSessionId,
    loading,
    error,
    submitting,
    refreshHistory,
    submitQuery,
    selectSession,
    updateUserId,
    clearError,
  } = useResearch();

  // Local state for forms
  const [newQuery, setNewQuery] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Character count for inputs
  const queryCharCount = getCharacterCount(newQuery, 1000);
  const followUpCharCount = getCharacterCount(followUp, 1000);

  // Handle new research query submission
  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!newQuery.trim() || queryCharCount.isOverLimit || submitting) return;

    setShowProgress(true);
    setProgressStep(0);

    // Simulate progress steps
    const steps = [
      'Connecting to research sources...',
      'Retrieving relevant documents...',
      'Analyzing information...',
      'Generating AI summary...',
    ];

    const progressInterval = setInterval(() => {
      setProgressStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(progressInterval);
        return prev;
      });
    }, 1000);

    try {
      const result = await submitQuery(newQuery);
      if (result) {
        setNewQuery('');
        setProgressStep(steps.length);
        setTimeout(() => {
          setShowProgress(false);
          setProgressStep(0);
        }, 1000);
      }
    } catch (err) {
      console.error('Failed to submit query:', err);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setShowProgress(false);
        setProgressStep(0);
      }, 2000);
    }
  };

  // Handle follow-up query submission
  const handleFollowUp = async (e) => {
    e.preventDefault();
    if (!followUp.trim() || followUpCharCount.isOverLimit || submitting) return;

    try {
      const result = await submitQuery(followUp);
      if (result) {
        setFollowUp('');
      }
    } catch (err) {
      console.error('Failed to submit follow-up:', err);
    }
  };

  // Handle sidebar actions
  const handleRefresh = () => {
    refreshHistory(selectedSessionId);
  };

  const handleClear = () => {
    selectSession(null);
  };

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Progress Overlay */}
      {showProgress && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <CardTitle>Processing Research Query</CardTitle>
              <CardDescription>Our AI is analyzing multiple sources for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Connecting to research sources...',
                'Retrieving relevant documents...',
                'Analyzing information...',
                'Generating AI summary...',
                'Research completed!',
              ].map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {index < progressStep ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : index === progressStep ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                  )}
                  <span className={`text-sm ${
                    index < progressStep ? 'text-green-600 font-medium' :
                    index === progressStep ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Header Card */}
            <Card className="bg-linear-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">AI Research Orchestrator</CardTitle>
                <CardDescription className="text-blue-100">
                  Advanced Multi-Source Intelligence
                </CardDescription>
              </CardHeader>
            </Card>

            {/* User Profile */}
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-linear-to-r from-blue-500 to-purple-500 text-white">
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">User #{userId}</CardTitle>
                  <CardDescription>{history.length} research sessions</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleToggleSettings}>
                  <Settings className="w-4 h-4" />
                </Button>
              </CardHeader>
            </Card>

            {/* User Settings (conditional) */}
            {showSettings && (
              <UserSettings
                userId={userId}
                onUserIdChange={updateUserId}
                onRefresh={handleRefresh}
                onClear={handleClear}
                loading={loading}
              />
            )}

            {/* Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Research Sessions
                </CardTitle>
                <CardDescription>Your previous research queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                <SessionList
                  sessions={history}
                  selectedSessionId={selectedSessionId}
                  onSessionSelect={selectSession}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active User</p>
                      <p className="text-2xl font-bold">#{userId}</p>
                    </div>
                    <User className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                      <p className="text-2xl font-bold">{history.length}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant={loading ? "warning" : "success"}>
                        {loading ? "Processing" : "Ready"}
                      </Badge>
                    </div>
                    <Brain className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-red-800 font-semibold">Error occurred</h4>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                      <Button variant="outline" size="sm" onClick={clearError} className="mt-2">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chat Container */}
            <Card className="flex-1">
              <CardContent className="p-8">
                <ChatContainer
                  session={selectedSession}
                  loading={loading}
                  error={error}
                />
              </CardContent>
            </Card>

            {/* Follow-up Section */}
            {selectedSession && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Continue Research
                  </CardTitle>
                  <CardDescription>
                    Current Topic: <span className="font-medium text-foreground">
                      {truncateText(selectedSession.query, 60)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFollowUp} className="space-y-4">
                    <Textarea
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                      placeholder="Ask a follow-up question on this topic..."
                      rows={3}
                      className="resize-none"
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        followUpCharCount.isOverLimit ? 'text-red-500' : 
                        followUpCharCount.percentage > 80 ? 'text-orange-500' : 'text-green-500'
                      }`}>
                        {followUpCharCount.count}/{followUpCharCount.maxLength}
                      </span>
                      
                      <Button
                        type="submit"
                        disabled={!followUp.trim() || followUpCharCount.isOverLimit || submitting}
                        loading={submitting}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Ask Follow-up
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* New Query Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Search className="w-6 h-6" />
                  New Research Query
                </CardTitle>
                <CardDescription>
                  Enter your research question and let our AI analyze multiple sources for comprehensive insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitQuery} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Research Question</label>
                    <Textarea
                      value={newQuery}
                      onChange={(e) => setNewQuery(e.target.value)}
                      placeholder="e.g., Latest developments in quantum computing for machine learning applications"
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      queryCharCount.isOverLimit ? 'text-red-500' : 
                      queryCharCount.percentage > 80 ? 'text-orange-500' : 'text-green-500'
                    }`}>
                      {queryCharCount.count}/{queryCharCount.maxLength}
                    </span>
                    
                    <Button
                      type="submit"
                      size="lg"
                      variant="gradient"
                      disabled={!newQuery.trim() || queryCharCount.isOverLimit || submitting}
                      loading={submitting}
                      className="px-8"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Start Research
                    </Button>
                  </div>
                </form>

                <Separator className="my-6" />

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Pro Tip</h4>
                      <p className="text-sm text-blue-700">
                        Be specific about what you want to learn. Include context, timeframes, or specific aspects 
                        you're interested in for better results.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
