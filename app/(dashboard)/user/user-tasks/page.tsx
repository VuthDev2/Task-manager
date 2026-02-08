"use client";
import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { Search, Plus, ChevronDown, MoreVertical, X, Bell, Trash2 } from 'lucide-react';

export default function MyTasks() {
  // --- STATE MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  // Initial Task Data
  const [tasks, setTasks] = useState([
    { id: 1, title: "Graphic Design", sub: "Prepare the branding file", date: "10 Feb", priority: "Medium", category: "Project", color: "bg-blue-500" },
    { id: 2, title: "Coffee Website", sub: "Client: Angkor Cafe", date: "25 Feb", priority: "High", category: "Work", color: "bg-orange-500" },
    { id: 3, title: "Mobile App", sub: "Car selling App UX", date: "05 Mar", priority: "Hard", category: "Personal", color: "bg-purple-500" },
  ]);

  // --- DELETE LOGIC ---
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // --- FILTER LOGIC ---
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
    const matchesCategory = filterCategory === "All" || task.category === filterCategory;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  // --- ADD TASK FUNCTION ---
  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const priority = formData.get("priority") as string;
    let taskColor = "bg-blue-500";
    if (priority === "High") taskColor = "bg-orange-500";
    if (priority === "Hard") taskColor = "bg-purple-500";

    const newTask = {
      id: Date.now(),
      title: formData.get("title") as string,
      sub: formData.get("sub") as string,
      date: "New",
      priority: priority,
      category: formData.get("category") as string,
      color: taskColor
    };

    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F9] font-sans">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Tasks</h1>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search Project..." 
                className="text-gray-400 pl-10 pr-4 py-2 bg-white rounded-full w-72 border-none shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="relative cursor-pointer hover:scale-110 transition-transform p-2 bg-white rounded-full shadow-sm">
              <Bell size={20} className="text-gray-600" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">Saravuth</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Project Manager</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-400 border-2 border-white shadow-sm overflow-hidden">
                <img src="/avatar.png" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* ACTION & FILTER SECTION */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-gray-800">Tasks list</h2>
              <p className="text-sm font-bold text-gray-500">You have {filteredTasks.length} tasks for today</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
            >
              <span className="font-black">Create Task</span>
              <div className="bg-white/20 p-1 rounded-lg"><Plus size={20} /></div>
            </button>
          </div>

          <div className="bg-[#D1E9ED]/50 backdrop-blur-sm p-2 rounded-2xl flex items-center gap-3 border border-[#B8DDE3]">
            <div className="flex-1 relative ml-2">
              <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search tasks..." 
                className="w-full bg-transparent pl-6 pr-4 py-2 outline-none text-sm font-bold text-gray-700 placeholder:text-gray-500" 
              />
            </div>

            <div className="relative">
              <FilterPill label={filterPriority === "All" ? "Priority" : filterPriority} />
              <select className="absolute inset-0 opacity-0 cursor-pointer w-full" onChange={(e) => setFilterPriority(e.target.value)} value={filterPriority}>
                <option value="All">All Priority</option><option value="Hard">Hard</option><option value="High">High</option><option value="Medium">Medium</option>
              </select>
            </div>

            <div className="relative">
              <FilterPill label={filterCategory === "All" ? "Category" : filterCategory} />
              <select className="absolute inset-0 opacity-0 cursor-pointer w-full" onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
                <option value="All">All Categories</option><option value="Project">Project</option><option value="Work">Work</option><option value="Personal">Personal</option>
              </select>
            </div>
            <FilterPill label="Status" />
          </div>
        </div>

        {/* TASK TABLE HEADERS */}
        <div className="grid grid-cols-12 px-6 mb-4 text-gray-400 font-black text-[11px] uppercase tracking-[0.2em]">
          <div className="col-span-5">Task Details</div>
          <div className="col-span-2 text-center">Due Date</div>
          <div className="col-span-2 text-center">Priority</div>
          <div className="col-span-2 text-center">Category</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} {...task} onDelete={() => deleteTask(task.id)} />
          ))}
          {filteredTasks.length === 0 && (
            <div className="py-20 text-center bg-white/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 font-black text-gray-400 italic">
               No tasks found matching your criteria.
            </div>
          )}
        </div>
      </main>

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-gray-100 rounded-full transition-all group">
                <X size={24} strokeWidth={3} className="text-gray-900 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Task Title</label>
                <input name="title" required className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl p-4 text-lg font-black text-gray-900 outline-none transition-all" placeholder="e.g. Design Branding" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Description</label>
                <input name="sub" required className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl p-4 font-black text-gray-700 outline-none transition-all" placeholder="Details..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Priority</label>
                  <select name="priority" className="w-full appearance-none bg-gray-50 rounded-2xl p-4 font-black text-gray-900 outline-none cursor-pointer"><option>Medium</option><option>High</option><option>Hard</option></select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-gray-900 tracking-[0.15em] ml-1">Category</label>
                  <select name="category" className="w-full appearance-none bg-gray-50 rounded-2xl p-4 font-black text-gray-900 outline-none cursor-pointer"><option>Project</option><option>Work</option><option>Personal</option></select>
                </div>
              </div>
              <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg mt-4 shadow-xl active:scale-95 transition-all">Create Task</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---
function FilterPill({ label }: { label: string }) {
  return (
    <div className="bg-white/80 px-4 py-1.5 rounded-xl flex items-center gap-2 text-[13px] font-black text-gray-700 shadow-sm border border-gray-100 pointer-events-none">
      {label} <ChevronDown size={14} className="text-gray-400" />
    </div>
  );
}

function TaskItem({ title, sub, date, priority, category, color, onDelete }: any) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center relative overflow-hidden group border border-transparent hover:border-gray-100">
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black" />
      <div className="grid grid-cols-12 w-full items-center">
        <div className="col-span-5 pl-6">
          <h4 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{title}</h4>
          <p className="text-xs text-gray-400 font-black">{sub}</p>
        </div>
        <div className="col-span-2 text-center"><span className="text-xs font-black text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">{date}</span></div>
        <div className="col-span-2 flex justify-center"><span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full text-white ${color}`}>{priority}</span></div>
        <div className="col-span-2 text-center text-xs font-black text-gray-400 uppercase tracking-widest">#{category}</div>
        <div className="col-span-1 flex justify-end pr-4">
          <button 
            onClick={onDelete} 
            className="text-gray-300 hover:text-red-500 transition-colors p-1"
            title="Delete Task"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}