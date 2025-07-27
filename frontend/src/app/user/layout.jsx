
import { AppSidebar } from '@/components/user-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react'


const Layout = ({ children }) => {
    return (
        <SidebarProvider>
            <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
                <AppSidebar />
                <main style={{ flex: 1, width: '100%' }}>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}

export default Layout;