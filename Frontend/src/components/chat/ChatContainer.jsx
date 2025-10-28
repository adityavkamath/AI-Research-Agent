import { useEffect, useRef } from 'react';
import { MessageSquare, Brain, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

/**
 * Chat container that displays all messages in a conversation
 */
const ChatContainer = ({ session, loading, error }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-spin">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <p className="text-muted-foreground font-medium">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md border-red-200 bg-red-50">
          <CardContent className="text-center p-6">
            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-red-800 mb-2">Failed to load conversation</h3>
            <p className="text-sm text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-lg space-y-6">
          <div className="w-20 h-20 mx-auto bg-linear-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">Welcome to AI Research</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Submit your first research query below to begin an intelligent conversation with our AI research assistant.
            </p>
          </div>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Get Started</h4>
                  <p className="text-sm text-blue-700">Ask about any topic you'd like to research!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const messages = session.messages || [];

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Conversation Ready</h3>
            <p className="text-muted-foreground">
              Session #{session.session_id} is active. Messages will appear here as you interact with the AI assistant.
            </p>
          </div>
          <Badge variant="success">Ready to chat</Badge>
        </div>
      </div>
    );
  }

  // Sort messages by timestamp
  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = new Date(a.timestamp || 0).getTime();
    const timeB = new Date(b.timestamp || 0).getTime();
    return timeA - timeB;
  });

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Research Conversation
          </h2>
          <p className="text-muted-foreground mt-1">
            Session #{session.session_id} • {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Badge variant="success" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Active
        </Badge>
      </div>

      {/* Messages container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-6 pr-2"
        style={{ maxHeight: 'calc(100vh - 500px)' }}
      >
        {sortedMessages.map((message, index) => (
          <MessageBubble 
            key={`${session.session_id}-${index}-${message.timestamp}`} 
            message={message} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;