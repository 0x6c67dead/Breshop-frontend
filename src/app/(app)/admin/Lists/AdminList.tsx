'use client'

import { useState } from "react"
import TagList from "./TagList"
import ProdutoList from "./ProdutoList"
import UserList from "./UserList"
import AddressList from "./AddressList"
import BrechoList from "./BrechoList"
import AdminNavInput from "../AdminNavInput"

export default function AdminList(){
    const [activeTab, setActiveTab] = useState<'user' | 'brecho' | 'produto' | 'tag' | 'address'>('user');
    
    return(
        <div className="flex flex-col md:flex-row gap-12">
            <aside className="w-full md:w-64 flex flex-col gap-2">
                <button onClick={() => setActiveTab('user')} className="text-left">
                    <AdminNavInput grupo="list" checked={activeTab === 'user'}>USER</AdminNavInput>
                </button>
                    
                <button onClick={() => setActiveTab('brecho')} className="text-left">
                    <AdminNavInput grupo="list">BRECHO</AdminNavInput>
                </button>
                    
                <button onClick={() => setActiveTab('produto')} className="text-left">
                    <AdminNavInput grupo="list">PRODUTO</AdminNavInput>
                </button>
                    
                <button onClick={() => setActiveTab('tag')} className="text-left">
                    <AdminNavInput grupo="list">TAG</AdminNavInput>
                </button>
                    
                <button onClick={() => setActiveTab('address')} className="text-left">
                    <AdminNavInput grupo="list">ADDRESS</AdminNavInput>
                </button>
            </aside>

            <main className="flex-1">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'address' && <AddressList />}
                    {activeTab === 'brecho' && <BrechoList />}
                    {activeTab === 'produto' && <ProdutoList />}
                    {activeTab === 'tag' && <TagList />}
                    {activeTab === 'user' && <UserList />}
                </div>
            </main>
        </div>    
    )
}