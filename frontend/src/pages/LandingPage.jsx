import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Users, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
        >
          TaskFlow
        </motion.div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-x-4"
        >
          <Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link>
          <Link to="/signup" className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors font-medium">Get Started</Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Manage your team's work in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">one place</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            The ultimate project management tool for modern teams. Assign tasks, track progress, and hit your deadlines with ease.
          </motion.p>
          <motion.div variants={itemVariants} className="flex justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 font-semibold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transform hover:-translate-y-1">
              Start for free
            </Link>
            <a href="#features" className="px-8 py-4 rounded-full bg-slate-800 hover:bg-slate-700 font-semibold text-lg transition-all border border-slate-700 hover:border-slate-600">
              See Features
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-6 py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <FeatureCard 
            icon={<LayoutDashboard className="w-8 h-8 text-blue-400" />}
            title="Intuitive Dashboard"
            description="Get a bird's-eye view of all your projects and upcoming deadlines."
          />
          <FeatureCard 
            icon={<CheckCircle2 className="w-8 h-8 text-emerald-400" />}
            title="Task Tracking"
            description="Create, assign, and track tasks from To-Do to Done."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-purple-400" />}
            title="Role-based Access"
            description="Admins can manage everything, while members focus on their assigned work."
          />
        </motion.div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm"
    >
      <div className="mb-6 p-4 bg-slate-900/50 rounded-xl inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
