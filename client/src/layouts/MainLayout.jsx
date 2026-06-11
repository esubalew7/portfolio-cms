import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useVisitorTracking } from '../hooks/useVisitorTracking';


export const MainLayout = () => {
  useVisitorTracking();
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />
      {/* 
        Add top padding to main to prevent content from hiding 
        behind the fixed navbar (py-5 + content size is roughly pt-20) 
      */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
