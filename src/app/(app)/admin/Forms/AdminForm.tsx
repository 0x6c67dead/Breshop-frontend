'use client'

import { useState } from "react"
import AdminNavInput from "../AdminNavInput"
import AddressForm from "./AddressForm";
import BrechoForm from "./BrechoForm";
import ProdutoForm from "./ProdutoForm";
import TagForm from "./TagForm";
import UserForm from "./UserForm";

export default function AdminForm(){
    const [activeTab, setActiveTab] = useState<'user' | 'brecho' | 'produto' | 'tag' | 'address'>('user');
    
    return( 
        <div className="flex flex-col gap-8">
            <nav className="flex flex-wrap gap-4 border-b-2 border-foreground/10 pb-6">
                <button onClick={() => setActiveTab('user')}>
                    <AdminNavInput grupo="form">USER</AdminNavInput>
                </button>
                    
                <button onClick={() => setActiveTab('brecho')}>
                    <AdminNavInput grupo="form">BRECHO</AdminNavInput>
                </button>
                    
                <button onClick={() => setActiveTab('produto')}>
                    <AdminNavInput grupo="form">PRODUTO</AdminNavInput>
                </button>
                    
                <button onClick={() => setActiveTab('tag')}>
                    <AdminNavInput grupo="form">TAG</AdminNavInput>
                </button>
                    
                <button onClick={() => setActiveTab('address')}>
                    <AdminNavInput grupo="form">ADDRESS</AdminNavInput>
                </button>
            </nav>

            <main className="w-full">
                {activeTab === 'address' && <AddressForm />}
                {activeTab === 'brecho' && <BrechoForm />}
                {activeTab === 'produto' && <ProdutoForm />}
                {activeTab === 'tag' && <TagForm />}
                {activeTab === 'user' && <UserForm />}
            </main>
        </div>
    )
}