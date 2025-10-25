import { useState } from 'react';
import { User, Building2, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: 'attendee',
      title: 'Attendee',
      description: 'Join events and connect with speakers',
      icon: User,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'organiser',
      title: 'Organiser',
      description: 'Create and manage events',
      icon: Building2,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'speaker',
      title: 'Speaker',
      description: 'Share your expertise at events',
      icon: Mic,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    navigate(`/register/${roleId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Join CrowdConnect</h1>
          <p className="text-gray-400 text-lg">Choose your role to get started</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="group relative bg-gray-800 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-gray-600"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{role.description}</p>
                  
                  <div className="mt-6 flex items-center justify-center text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:from-white group-hover:to-white transition-all">
                    Continue as {role.title}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
