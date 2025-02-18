import React from 'react'
import Header from './include/Header'
import Footer from './include/Footer'

function Base({children}) {

    return (
        <>
            <main className="min-h-screen">
                <Header/>
                {children}
                <Footer/>
            </main>
        </>
    )
}

export default Base