import { ChevronRight, MessageSquare, Clock } from 'lucide-react';
import { formatTimestamp, truncateText } from '../../utils/helpers';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

/**
 * Session list item component with modern card design
 */
const SessionItem = ({ session, isSelected, onClick }) => {
  const { session_id, query, created_at, messages = [] } = session;
  
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        isSelected && 'ring-2 ring-primary bg-primary/5'
      )}
      onClick={() => onClick(session_id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ChevronRight 
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                isSelected ? 'rotate-90 text-primary' : 'text-muted-foreground'
              )} 
            />
            <Badge variant={isSelected ? 'default' : 'outline'} className="text-xs">
              #{session_id}
            </Badge>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {messages.length}
          </Badge>
        </div>
        
        <p className="text-sm text-foreground mb-3 line-clamp-2 leading-relaxed">
          {truncateText(query, 80)}
        </p>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          {formatTimestamp(created_at)}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Session list component with modern design
 */
const SessionList = ({ 
  sessions = [], 
  selectedSessionId, 
  onSessionSelect, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 mx-auto mb-3 bg-primary rounded-full flex items-center justify-center animate-spin">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <p className="text-sm text-muted-foreground">Loading sessions...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium mb-2">No sessions found</p>
        <p className="text-xs text-muted-foreground">
          Submit a query below to start your first research session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <SessionItem
          key={session.session_id}
          session={session}
          isSelected={session.session_id === selectedSessionId}
          onClick={onSessionSelect}
        />
      ))}
    </div>
  );
};

export default SessionList;