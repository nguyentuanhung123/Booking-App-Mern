import { Outlet } from "react-router-dom";
import Header from "./Header";
import Languageoption from "./language-dropdown";
import i18next from "i18next";

const Layout = () => {
    const handleClick = (e) => {
        i18next.changeLanguage(e.target.value);
    }
    
    return(
        <div className="py-4 px-8 flex flex-col min-h-screen">
            <Header />
            <Languageoption onChange={(e) => handleClick(e)}/>
            <Outlet />
        </div>
    )
}
export default Layout;