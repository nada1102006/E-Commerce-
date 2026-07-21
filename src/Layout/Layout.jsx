import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';
import Header from "../pages/Header"; 
import Footr from "../pages/Footr";


export default function Layout() {
    const { isDarkMode, setIsDarkMode } = useTheme();

    return (
        <div>
            <header >
               <Header/>
            </header>

            <main className="flex-1  ">
                <Outlet />
            </main>

            <footer>
                <Footr/>
            </footer>
                  

        </div>
    );
}