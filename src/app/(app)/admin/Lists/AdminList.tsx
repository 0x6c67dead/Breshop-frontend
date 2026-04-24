'use client'

import { useState } from "react"

import TagList from "./TagList"
import ProdutoList from "./ProdutoList"
import UserList from "./UserList"
import AddressList from "./AddressList"
import BrechoList from "./BrechoList"

import AdminNavInput from "../AdminNavInput"


export default function AdminList(){
    const [isUserListOpen, setUserListOpen] = useState(false)    
    const [isBrechoListOpen, setBrechoListOpen] = useState(false)    
    const [isProdutoListOpen, setProdutoListOpen] = useState(false)    
    const [isTagListOpen, setTagListOpen] = useState(false)    
    const [isAddressListOpen, setAddressListOpen] = useState(false)    
    
    function handleAddressListOpen(){
        setBrechoListOpen(false)
        setProdutoListOpen(false)
        setTagListOpen(false)
        setUserListOpen(false)
        setAddressListOpen(true)
    }
    function handleBrechoListOpen(){
        setAddressListOpen(false)
        setProdutoListOpen(false)
        setTagListOpen(false)
        setUserListOpen(false)
        setBrechoListOpen(true)
    }
    function handleProdutoListOpen(){
        setAddressListOpen(false)
        setBrechoListOpen(false)
        setTagListOpen(false)
        setUserListOpen(false)
        setProdutoListOpen(true)
    }
    function handleTagListOpen(){
        setAddressListOpen(false)
        setBrechoListOpen(false)
        setProdutoListOpen(false)
        setUserListOpen(false)
        setTagListOpen(true)
    }
    function handleUserListOpen(){
        setAddressListOpen(false)
        setBrechoListOpen(false)
        setProdutoListOpen(false)
        setTagListOpen(false)
        setUserListOpen(true)
    }
    return(
        <>
            <nav className="absolute flex justify-center top-30 left-1/2 -translate-1/2 w-full gap-10">
                <button onClick={handleUserListOpen}>
                    <AdminNavInput grupo="list">User</AdminNavInput>
                </button>
                    
                <button onClick={handleBrechoListOpen}>
                    <AdminNavInput grupo="list">Brecho</AdminNavInput>
                </button>
                    
                <button onClick={handleProdutoListOpen}>
                    <AdminNavInput grupo="list">Produto</AdminNavInput>
                </button>
                    
                <button onClick={handleTagListOpen}>
                    <AdminNavInput grupo="list">Tag</AdminNavInput>
                </button>
                    
                <button onClick={handleAddressListOpen}>
                    <AdminNavInput grupo="list">Address</AdminNavInput>
                </button>
            </nav>
            <main className="pt-22 w-2/4">
                {isAddressListOpen && (
                    <AddressList />
                )}
                {isBrechoListOpen && (
                    <BrechoList />
                )}
                {isProdutoListOpen && (
                    <ProdutoList />
                )}
                {isTagListOpen && (
                    <TagList />
                )}
                {isUserListOpen && (
                    <UserList />
                )}
            </main>
        </>    
    )
}