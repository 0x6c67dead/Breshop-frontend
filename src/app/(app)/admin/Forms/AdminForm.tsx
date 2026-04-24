'use client'

import { useState } from "react"

import AdminNavInput from "../AdminNavInput"

import AddressForm from "./AddressForm";
import BrechoForm from "./BrechoForm";
import ProdutoForm from "./ProdutoForm";
import TagForm from "./TagForm";
import UserForm from "./UserForm";


export default function AdminForm(){
    const [isUserFormOpen, setUserFormOpen] = useState(false)    
    const [isBrechoFormOpen, setBrechoFormOpen] = useState(false)    
    const [isProdutoFormOpen, setProdutoFormOpen] = useState(false)    
    const [isTagFormOpen, setTagFormOpen] = useState(false)    
    const [isAddressFormOpen, setAddressFormOpen] = useState(false)    
    
    function handleAddressFormOpen(){
        setBrechoFormOpen(false)
        setProdutoFormOpen(false)
        setTagFormOpen(false)
        setUserFormOpen(false)
        setAddressFormOpen(true)
    }
    function handleBrechoFormOpen(){
        setAddressFormOpen(false)
        setProdutoFormOpen(false)
        setTagFormOpen(false)
        setUserFormOpen(false)
        setBrechoFormOpen(true)
    }
    function handleProdutoFormOpen(){
        setAddressFormOpen(false)
        setBrechoFormOpen(false)
        setTagFormOpen(false)
        setUserFormOpen(false)
        setProdutoFormOpen(true)
    }
    function handleTagFormOpen(){
        setAddressFormOpen(false)
        setBrechoFormOpen(false)
        setProdutoFormOpen(false)
        setUserFormOpen(false)
        setTagFormOpen(true)
    }
    function handleUserFormOpen(){
        setAddressFormOpen(false)
        setBrechoFormOpen(false)
        setProdutoFormOpen(false)
        setTagFormOpen(false)
        setUserFormOpen(true)
    }
    
    return( 
        <>
            <nav className="absolute flex justify-center top-30 left-1/2 -translate-1/2 w-full gap-10">
                <button onClick={handleUserFormOpen}>
                    <AdminNavInput grupo="form">User</AdminNavInput>
                </button>
                    
                <button onClick={handleBrechoFormOpen}>
                    <AdminNavInput grupo="form">Brecho</AdminNavInput>
                </button>
                    
                <button onClick={handleProdutoFormOpen}>
                    <AdminNavInput grupo="form">Produto</AdminNavInput>
                </button>
                    
                <button onClick={handleTagFormOpen}>
                    <AdminNavInput grupo="form">Tag</AdminNavInput>
                </button>
                    
                <button onClick={handleAddressFormOpen}>
                    <AdminNavInput grupo="form">Address</AdminNavInput>
                </button>
            </nav>
            <main className="pt-22 w-2/4">
                {isAddressFormOpen && (
                    <AddressForm />
                )}
                {isBrechoFormOpen && (
                    <BrechoForm />
                )}
                {isProdutoFormOpen && (
                    <ProdutoForm />
                )}
                {isTagFormOpen && (
                    <TagForm />
                )}
                {isUserFormOpen && (
                    <UserForm />
                )}
            </main>
        </>
    )
}