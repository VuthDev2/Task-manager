"use client";
import React from 'react';

const featureData = [
  { title: "Task Progress", desc: "Send scheduling links guests love", bg: "bg-[#FFFCE6]", accent: "border-orange-400" },
  { title: "Plan Calendar", desc: "Send scheduling links guests love", bg: "bg-[#F5F0FF]", accent: "border-purple-400" },
  { title: "Collaborations", desc: "Send scheduling links guests love", bg: "bg-[#E6F9FF]", accent: "border-blue-400" }
];

export default function Features() {
  return (
    <section className="bg-white py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">Features</p>
          <h2 className="text-5xl font-black text-gray-900 tracking-tight">The features <br /> Both familiar and new.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureData.map((f, i) => (
            <div key={i} className={`${f.bg} rounded-[3rem] p-10 h-[450px] border border-white shadow-sm flex flex-col hover:shadow-lg transition-all group`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full border-2 ${f.accent}`} />
                <h3 className="text-xl font-black text-gray-900">{f.title}</h3>
              </div>
              <p className="text-sm font-bold text-gray-500 max-w-[180px]">{f.desc}</p>
              
              {/* Fake dashboard item inside the card */}
              <div className="mt-auto bg-white rounded-2xl h-48 shadow-2xl border border-gray-50 translate-y-6 group-hover:-translate-y-2 transition-transform duration-500 p-4">
                <div className="w-12 h-2 bg-gray-100 rounded-full mb-3" />
                <div className="w-full h-1 bg-gray-50 rounded-full mb-2" />
                <div className="w-2/3 h-1 bg-gray-50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}