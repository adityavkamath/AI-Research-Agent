import { useState } from 'react';
import { RefreshCw, Trash2, Plus, User, Users } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';

/**
 * Enhanced User settings section with user management functionality
 */
const UserSettings = ({ userId, onUserIdChange, onRefresh, onClear, loading }) => {
  const [storedUsers, setStoredUsers] = useState(() => {
    // Load stored users from localStorage
    const saved = localStorage.getItem('ai-research-users');
    return saved ? JSON.parse(saved) : [{ id: 1, name: 'User 1', createdAt: new Date().toISOString() }];
  });

  const [newUserName, setNewUserName] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);

  // Save users to localStorage whenever storedUsers changes
  const saveUsers = (users) => {
    setStoredUsers(users);
    localStorage.setItem('ai-research-users', JSON.stringify(users));
  };

  const handleCreateNewUser = () => {
    if (!newUserName.trim()) return;
    
    const newId = Math.max(...storedUsers.map(u => u.id), 0) + 1;
    const newUser = {
      id: newId,
      name: newUserName.trim(),
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...storedUsers, newUser];
    saveUsers(updatedUsers);
    
    // Switch to the new user
    onUserIdChange(newId);
    
    // Reset form
    setNewUserName('');
    setShowAddUser(false);
  };

  const handleDeleteUser = (userIdToDelete) => {
    if (storedUsers.length <= 1) return; // Don't allow deleting the last user
    
    const updatedUsers = storedUsers.filter(u => u.id !== userIdToDelete);
    saveUsers(updatedUsers);
    
    // If we deleted the current user, switch to the first available user
    if (userId === userIdToDelete) {
      onUserIdChange(updatedUsers[0].id);
    }
  };

  const currentUser = storedUsers.find(u => u.id === userId) || storedUsers[0];

  return (
    <Card className="border-0 shadow-lg bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-blue-600" />
          User Management
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current User Display */}
        <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <Avatar className="h-12 w-12 border-2 border-blue-200">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
              {currentUser?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {currentUser?.name || `User ${userId}`}
              </h3>
              <Badge variant="secondary" className="text-xs">
                ID: {userId}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current active user
            </p>
          </div>
        </div>

        <Separator />

        {/* User List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">All Users</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddUser(!showAddUser)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add New User Form */}
          {showAddUser && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <Input
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user name..."
                className="h-9"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateNewUser()}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleCreateNewUser}
                  disabled={!newUserName.trim()}
                  className="flex-1 h-8"
                >
                  Create User
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddUser(false);
                    setNewUserName('');
                  }}
                  className="h-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* User List */}
          <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
            {storedUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                  user.id === userId
                    ? 'bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => onUserIdChange(user.id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-500">ID: {user.id}</p>
                </div>
                {storedUsers.length > 1 && user.id !== userId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user.id);
                    }}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Sessions
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserSettings;