// src/components/layout/DashboardLayout.tsx
import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 xl:ml-64">
          <div className="container mx-auto px-4 lg:px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
