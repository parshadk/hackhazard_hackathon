import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ProfileStats from '../components/profile/ProfileStats';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { BookOpen, Award, Settings } from 'lucide-react';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    avatar: '',
    level: 3,
    levelTitle: 'Finance Explorer',
    xp: 350,
    maxXp: 500,
    completedLessons: 8,
    totalLessons: 20,
    joinDate: 'May 1, 2025',
    streak: 7,
  };
  
  // Mock achievements data
  const achievements = [
    {
      id: 'a1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: <BookOpen size={18} className="text-blue-600" />,
      isEarned: true,
      earnedDate: 'May 2, 2025',
    },
    {
      id: 'a2',
      title: 'Knowledge Seeker',
      description: 'Complete 5 lessons',
      icon: <BookOpen size={18} className="text-blue-600" />,
      isEarned: true,
      earnedDate: 'May 7, 2025',
    },
    {
      id: 'a3',
      title: 'Quiz Master',
      description: 'Score 100% on 3 quizzes',
      icon: <Award size={18} className="text-green-600" />,
      isEarned: false,
    },
    {
      id: 'a4',
      title: 'Dedicated Learner',
      description: 'Maintain a 7-day streak',
      icon: <Award size={18} className="text-green-600" />,
      isEarned: true,
      earnedDate: 'May 14, 2025',
    },
  ];

  return (
    <PageContainer
      title="Profile"
      description="Your learning journey"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileStats user={user} />
          
          <div className="mt-6">
            <Card className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">Achievements</h3>
                <Badge className="bg-blue-100 text-blue-800">
                  {achievements.filter(a => a.isEarned).length}/{achievements.length} Earned
                </Badge>
              </div>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.isEarned 
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="bg-white p-2 rounded-full mr-3">
                        {achievement.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          {achievement.isEarned && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Earned
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                        
                        {achievement.isEarned && achievement.earnedDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Earned on {achievement.earnedDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        
        <div>
          <Card className="p-5">
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 p-2 rounded-full mr-3">
                <Settings size={18} className="text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900">Account Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Profile Information</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Update your personal details and preferences
                </p>
                <button className="mt-2 text-sm text-blue-600 font-medium">
                  Edit Profile
                </button>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Notification Settings</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Control how and when we contact you
                </p>
                <button className="mt-2 text-sm text-blue-600 font-medium">
                  Manage Notifications
                </button>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Control your data and privacy preferences
                </p>
                <button className="mt-2 text-sm text-blue-600 font-medium">
                  View Privacy Settings
                </button>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="text-sm text-red-600 font-medium">
                Log Out
              </button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;