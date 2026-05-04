import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, LayoutDashboard, CheckSquare, Folder } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [view, setView] = useState('dashboard');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '', dueDate: '' });
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: '', description: '' });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, tasksRes, projectsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/api/tasks`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setStats(statsRes.data);
        setTasks(tasksRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const startEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({ title: project.title, description: project.description || '' });
  };

  const cancelEditProject = () => {
    setEditingProject(null);
    setProjectForm({ title: '', description: '' });
  };

  const saveProject = async () => {
    if (!editingProject || !projectForm.title) {
      alert('Project title is required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_BASE}/api/projects/${editingProject._id}`, {
        title: projectForm.title,
        description: projectForm.description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.map(p => p._id === res.data._id ? res.data : p));
      cancelEditProject();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/api/tasks/${taskId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      await fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async () => {
    if (!newTask.title || !newTask.projectId) {
      alert('Please fill in title and project');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: newTask.title,
        description: newTask.description,
        project: newTask.projectId,
        dueDate: newTask.dueDate || undefined,
      };
      const res = await axios.post(`${API_BASE}/api/tasks`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedTasks = [...tasks, res.data];
      setTasks(updatedTasks);
      setNewTask({ title: '', description: '', projectId: '', dueDate: '' });
      setShowNewTaskForm(false);
      await fetchStats();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="text-2xl font-bold text-blue-600 mb-8">TaskFlow</div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setView('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'projects' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Folder size={20} /> Projects
          </button>
          <button onClick={() => setView('tasks')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === 'tasks' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
            <CheckSquare size={20} /> Tasks
          </button>
        </nav>
        <div className="border-t border-slate-200 pt-6 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-slate-800">{user.name}</div>
              <div className="text-sm text-slate-500">{user.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium w-full px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        {view === 'dashboard' && (
          <>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>
            
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {user.role === 'Admin' && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-500 text-sm font-medium mb-2">Total Projects</div>
                    <div className="text-3xl font-bold text-slate-800">{stats.totalProjects}</div>
                  </div>
                )}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-sm font-medium mb-2">Total Tasks</div>
                  <div className="text-3xl font-bold text-slate-800">{stats.totalTasks}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-sm font-medium mb-2">Overdue Tasks</div>
                  <div className="text-3xl font-bold text-red-600">{stats.overdueTasks}</div>
                </div>
              </div>
            )}

            {user.role !== 'Admin' && stats && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-10">
                <h2 className="text-lg font-bold text-slate-800 mb-3">My Profile</h2>
                <div className="text-sm text-slate-500 mb-1">Name: {user.name}</div>
                <div className="text-sm text-slate-500 mb-1">Email: {user.email}</div>
                <div className="text-sm text-slate-500">Role: {user.role}</div>
              </div>
            )}

            {/* Tasks List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">{user.role === 'Admin' ? 'Your Tasks' : 'My Tasks'}</h2>
                {user.role === 'Admin' && (
                  <button onClick={() => setShowNewTaskForm(!showNewTaskForm)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    + New Task
                  </button>
                )}
              </div>
              {showNewTaskForm && (
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 space-y-3">
                  <input type="text" placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2" />
                  <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2" rows="2" />
                  <select value={newTask.projectId} onChange={(e) => setNewTask({...newTask, projectId: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2">
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2" />
                  <div className="flex gap-2">
                    <button onClick={createTask} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium">Create</button>
                    <button onClick={() => setShowNewTaskForm(false)} className="bg-slate-300 hover:bg-slate-200 px-4 py-2 rounded text-sm font-medium">Cancel</button>
                  </div>
                </div>
              )}
              <div className="divide-y divide-slate-100">
                {tasks.map(task => (
                  <div key={task._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">{task.title}</h3>
                      <div className="text-sm text-slate-500">Project: {task.project?.title || 'Unknown'}</div>
                      {user.role === 'Admin' && (
                        <div className="text-sm text-slate-500">Assignee: {task.assignee?.name || 'Unassigned'}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.status}
                      </span>
                      <select 
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="border border-slate-200 rounded text-sm p-1"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="p-6 text-center text-slate-500">No tasks found.</div>
                )}
              </div>
            </div>
          </>
        )}

        {view === 'tasks' && (
          <>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">{user.role === 'Admin' ? 'All Tasks' : 'My Tasks'}</h1>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">{user.role === 'Admin' ? 'Tasks List' : 'My Tasks'}</h2>
                {user.role === 'Admin' && (
                  <button onClick={() => setShowNewTaskForm(!showNewTaskForm)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    + New Task
                  </button>
                )}
              </div>
              {showNewTaskForm && (
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 space-y-3">
                  <input type="text" placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2" />
                  <textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2" rows="2" />
                  <select value={newTask.projectId} onChange={(e) => setNewTask({...newTask, projectId: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2">
                    <option value="">Select Project</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className="w-full border border-slate-200 rounded px-3 py-2" />
                  <div className="flex gap-2">
                    <button onClick={createTask} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium">Create</button>
                    <button onClick={() => setShowNewTaskForm(false)} className="bg-slate-300 hover:bg-slate-200 px-4 py-2 rounded text-sm font-medium">Cancel</button>
                  </div>
                </div>
              )}
              <div className="divide-y divide-slate-100">
                {tasks.map(task => (
                  <div key={task._id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">{task.title}</h3>
                      <div className="text-sm text-slate-500">{task.description || 'No description'}</div>
                      <div className="text-xs text-slate-400 mt-1">Project: {task.project?.title || 'Unknown'}</div>
                      {user.role === 'Admin' && (
                        <div className="text-xs text-slate-400 mt-1">Assignee: {task.assignee?.name || 'Unassigned'}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.status}
                      </span>
                      <select 
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="border border-slate-200 rounded text-sm p-1"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="p-6 text-center text-slate-500">No tasks found.</div>
                )}
              </div>
            </div>
          </>
        )}

        {view === 'projects' && (
          <>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Projects</h1>
            {editingProject && (
              <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">Edit Project</h2>
                    <p className="text-sm text-slate-500">Update the project details below.</p>
                  </div>
                  <button onClick={cancelEditProject} className="text-slate-500 hover:text-slate-700">Cancel</button>
                </div>
                <div className="grid gap-4">
                  <input
                    type="text"
                    placeholder="Project title"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full border border-slate-200 rounded px-3 py-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full border border-slate-200 rounded px-3 py-2"
                    rows="3"
                  />
                  <button onClick={saveProject} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium">Save Changes</button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{project.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{project.description || 'No description'}</p>
                  <div className="text-xs text-slate-500 mb-3">
                    Owner: {project.owner?.name || 'Unknown'}
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    Members: {project.members?.length || 0}
                  </div>
                  {user.role === 'Admin' && (
                    <button onClick={() => startEditProject(project)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium">Edit</button>
                  )}
                </div>
              ))}
              {projects.length === 0 && (
                <div className="col-span-full text-center p-12 text-slate-500">No projects found.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
