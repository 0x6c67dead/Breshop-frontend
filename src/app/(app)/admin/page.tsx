'use client'
import AdminNavInput from "./AdminNavInput";
import { useState } from "react";
import AdminForm from "./Forms/AdminForm";
import AdminList from "./Lists/AdminList";

export default function Admin() {
    const [isFormPage, setFormPage] = useState(false);
    const [isListPage, setListPage] = useState(true);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex-1 flex flex-col items-center px-4 md:px-10 py-12 gap-10">
                <header className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-end gap-6 mb-8 border-b border-foreground/10 pb-10">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-serif font-black italic uppercase tracking-tighter leading-none">
                            Admin.
                        </h1>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 mt-4">
                            Inventory Management & Operations
                        </p>
                    </div>
                    
                    <div className="flex bg-white rounded-full p-1.5 border border-foreground/10 shadow-sm">
                        <button 
                            onClick={() => { setListPage(true); setFormPage(false); }}
                            className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isListPage ? 'bg-foreground text-background shadow-lg' : 'text-foreground/40 hover:text-foreground'}`}
                        >
                            Overview
                        </button>
                        <button 
                            onClick={() => { setFormPage(true); setListPage(false); }}
                            className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isFormPage ? 'bg-foreground text-background shadow-lg' : 'text-foreground/40 hover:text-foreground'}`}
                        >
                            Creation
                        </button>
                    </div>
                </header>

                <main className="w-full max-w-7xl">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl border border-foreground/5 min-h-[60vh]">
                        {isFormPage && <AdminForm />}
                        {isListPage && <AdminList />}
                    </div>
                </main>
            </div>
        </div>
    )
}