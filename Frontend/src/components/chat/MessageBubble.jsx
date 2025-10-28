import { formatTimestamp } from '../../utils/helpers';
import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { User, Brain, Settings } from 'lucide-react';

/**
 * Individual message bubble component with modern card-based design
 */
const MessageBubble = ({ message }) => {
  const { role, content, timestamp } = message;
  
  const getMessageConfig = (role) => {
    switch (role?.toLowerCase()) {
      case 'user':
        return {
          sender: 'You',
          icon: <User className="w-4 h-4" />,
          cardClass: 'ml-auto max-w-[85%] bg-linear-to-r from-blue-500 to-purple-500 text-white border-0',
          avatarClass: 'bg-white/20',
          badgeVariant: 'secondary',
          textClass: 'text-white/95'
        };
      case 'system':
        return {
          sender: 'System',
          icon: <Settings className="w-4 h-4" />,
          cardClass: 'mx-auto max-w-[90%] bg-amber-50 border-amber-200',
          avatarClass: 'bg-amber-100 text-amber-600',
          badgeVariant: 'warning',
          textClass: 'text-amber-800'
        };
      default:
        return {
          sender: 'AI Assistant',
          icon: <Brain className="w-4 h-4" />,
          cardClass: 'mr-auto max-w-[85%]',
          avatarClass: 'bg-linear-to-r from-green-500 to-blue-500 text-white',
          badgeVariant: 'default',
          textClass: 'text-foreground'
        };
    }
  };

  const config = getMessageConfig(role);

  return (
    <div className="flex items-start space-x-3">
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={config.avatarClass}>
          {config.icon}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <Badge variant={config.badgeVariant} className="text-xs">
            {config.sender}
          </Badge>
          {timestamp && (
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(timestamp)}
            </span>
          )}
        </div>
        
        <Card className={config.cardClass}>
          <CardContent className="p-4">
            <div className={cn('leading-relaxed whitespace-pre-wrap', config.textClass)}>
              {content}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageBubble;