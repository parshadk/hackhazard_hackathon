import { Link } from "react-router-dom";
import { Users, Code, BookOpen, BarChart2, Rocket, Award, Linkedin, Github } from "lucide-react";

export default function AboutUs() {
  const teamMembers = [
    {
      name: "Gaurav Kanojia",
      role: "Founder & Developer",
      linkedin: "https://www.linkedin.com/in/gaurav-kanojia-9071432a9/",
      github: "https://github.com/Gauravk100",
      initials: "GK"
    },
    {
      name: "Parshad Keni",
      role: "Contributor",
      linkedin: "https://www.linkedin.com/in/parshad-keni/",
      github: "https://www.linkedin.com/in/parshad-keni/",
      initials: "PK"
    },
    {
      name: "Vivek Barman",
      role: "Contributor",
      linkedin: "https://www.linkedin.com/in/vivek-barman",
      github: "https://github.com/howtoquitvivek",
      initials: "VB"
    },
    {
      name: "Nitin Yadav",
      role: "Contributor",
      linkedin: "https://www.linkedin.com/in/nitin-yadav-8979b12aa",
      github: "https://github.com/Nitinref",
      initials: "NY"
    }
  ];

  const techStack = [
    {
      icon: <Code className="h-5 w-5" />,
      title: "Modern Tech Stack",
      description: "Built with cutting-edge technologies for optimal performance"
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Interactive Learning",
      description: "Gamified approach to financial education"
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      title: "Real-time Data",
      description: "Live financial insights and market data"
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "AI Integration",
      description: "Personalized learning experiences with Groq AI"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 text-slate-800 flex flex-col relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-300 to-white rounded-full opacity-20 blur-xl transform -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-400 to-white rounded-full opacity-20 blur-xl transform translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-white/80 via-indigo-50/80 to-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
          <img src="/white.png" alt="EduFinance Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-indigo-700">EduFinance</h1>
          </Link>
          <div className="flex items-center space-x-6">
            <Link 
              to="/login" 
              className="text-slate-700 hover:text-indigo-600 font-medium transition-colors px-3 py-1 rounded-lg hover:bg-white/30"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow hover:shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow relative z-10 py-12">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 leading-tight">
            About <span className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-transparent bg-clip-text">EduFinance</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Gamifying financial literacy for the next generation through interactive learning.
          </p>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-white/20">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center">
                  <Users className="h-24 w-24 text-indigo-500 opacity-70" />
                </div>
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Our <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-transparent bg-clip-text">Mission</span>
                </h2>
                <p className="text-slate-600 mb-4">
                  EduFinance is a gamified financial literacy platform built to help students learn, engage, and grow in personal finance through interactive content, real-time insights, and AI-driven experiences.
                </p>
                <p className="text-slate-600 mb-6">
                  Born from a hackathon project, we're passionate about making financial education intuitive, accessible, and engaging for learners of all backgrounds.
                </p>
                <div className="flex items-center space-x-2 text-indigo-600">
                  <Award className="h-5 w-5" />
                  <span className="font-medium">Hackathon Project</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Our <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-transparent bg-clip-text">Technology</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We leverage cutting-edge tools to deliver an exceptional learning experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {techStack.map((tech, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  {tech.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
                  {tech.title}
                </h3>
                <p className="text-slate-600">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Meet the <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-transparent bg-clip-text">Team</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              The passionate people behind EduFinance
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <div 
                key={member.name}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-700 text-2xl font-bold">
                  {member.initials}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-indigo-600 mb-4">
                  {member.role}
                </p>
                <div className="flex justify-center space-x-3">
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </a>
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-12">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to transform financial education?
            </h2>
            <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
              Join us on our mission to make financial literacy accessible and engaging for students everywhere.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-all shadow hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-xl border-t border-white/50 py-12 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-blue-100 to-indigo-100"></div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center space-x-3 justify-center md:justify-start">
            <img src="/white.png" alt="EduFinance Logo" className="h-8 w-8" />
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-blue-600 text-transparent bg-clip-text">EduFinance</span>
            </div>
           
            <div className="text-slate-500  text-md text-center md:text-right ">
              © {new Date().getFullYear()} EduFinance. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}