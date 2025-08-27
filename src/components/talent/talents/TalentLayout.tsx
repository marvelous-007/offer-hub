import React from 'react'

const TalentLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <section className='px-6 py-6'>
        <div className='bg-white rounded-lg p-8 max-w-2xl mx-auto'>
            {children}
        </div>
        </section>
    )
}

export default TalentLayout
