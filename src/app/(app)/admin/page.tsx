'use client'
import Header from "@/src/shared/components/header/Header";
import AdminNavInput from "./AdminNavInput";

import { useState } from "react";
import AdminForm from "./Forms/AdminForm";
import AdminList from "./Lists/AdminList";



export default function Admin() {
    const [isFormPage, setFormPage] = useState(false);
    const [isListPage, setListPage] = useState(false);

    function handleFormPage() {
        setFormPage(true)
        setListPage(false)
    }

    function handleListPage() {
        setListPage(true)
        setFormPage(false)
    }

    return (
        <>
            <Header />
            <div className=" relative flex flex-col items-center mx-10 mt-25 p-20 gap-10 bg-gray-900">
                <nav className="fixed flex left-20 top-35 gap-10">
                    <button onClick={handleListPage}>
                        <AdminNavInput grupo="navPage">LIST</AdminNavInput>
                    </button>

                    <button onClick={handleFormPage} >
                        <AdminNavInput grupo="navPage">POST</AdminNavInput>
                    </button>
                </nav>
                <main className="flex flex-col justify-center items-center w-full pb-20">
                    {isFormPage && (
                        <AdminForm />
                    )}
                    {isListPage && (
                        <AdminList />
                    )}
                </main>
            </div>
        </>
    )
}