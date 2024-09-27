"use client";
import { useContext, useState, useEffect, useRef } from "react";
import { Squash as Hamburger } from "hamburger-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const linksRef = useRef([]);

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setOpen(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setActiveLink(pathname);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const activeIndex = [
      "",
      "services",
      "about",
      "contact",
      "universities",
      "testimonial",
    ].indexOf(activeLink.replace("/", ""));
    if (linksRef.current[activeIndex]) {
      const link = linksRef.current[activeIndex];
      setIndicatorStyle({
        width: `${link.offsetWidth}px`,
        left: `${link.offsetLeft}px`,
      });
    }
  }, [activeLink]);

  const linkNames = {
    "/": "Home",
    "/services": "Services",
    "/about": "About Us",
    "/contact": "Contact Us",
    "/universities": "Universities",
    "/testimonial": "Testimonials",
  };

  return (
    <header className="w-[100vw] h-auto fixed shadow-lg bg-white z-100">
      {/* Main Navbar section */}
      <div className="w-[85%] py-[1.4rem] flex justify-between mx-auto items-center relative">
        <div className="flex items-center justify-between w-full">
          <div>
            <Link href={"/"} aria-label="Home" className="text-[#71c55d] text-xl font-bold">
              logo
            </Link>
          </div>
          <div>
            {/* Pages list */}
            <ul className="list lg:flex gap-[2rem] xl:gap-[3rem] lg:text-[14px] hidden relative">
              {Object.keys(linkNames).map((path, index) => (
                <li key={path} ref={(el) => (linksRef.current[index] = el)}>
                  <Link
                    key={path}
                    href={path}
                    ref={(el) => (linksRef.current[index] = el)}
                    className={`relative top-[2px] ${
                      activeLink === path ? "text-[#71c55d]" : ""
                    }`}
                    onClick={() => handleLinkClick(path)}
                  >
                    {linkNames[path]}
                  </Link>
                </li>
              ))}
              {/* Blue bar */}
              <div
                className="absolute -bottom-[26px] h-[3px] bg-[#71c55d] transition-all duration-300"
                style={indicatorStyle}
              ></div>
            </ul>
          </div>
        </div>

        {/* Burger icon */}
        <div className="lg:hidden">
          <Hamburger toggled={isOpen} toggle={setOpen} size={20} />
        </div>
      </div>

      {/* Mobile menu section */}
      <nav
        className={`w-full overflow-hidden transition-max-height duration-500 ease-in-out bg-gray-100 ${
          isOpen ? "h-[100vh] opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div className="text-[16px] flex flex-col font-bold px-8 pt-6">
          {Object.keys(linkNames).map((path, index) => (
            <div key={path}>
              <Link
                href={path}
                className={activeLink === path ? "text-[#1F94F3]" : ""}
                onClick={() => handleLinkClick(path)}
              >
                {linkNames[path]}
              </Link>
              {index < Object.keys(linkNames).length - 1 && (
                <hr className="my-5 bg-[#5C6066]" />
              )}
            </div>
          ))}
        </div>
        {/* Buttons */}
        <div className="flex items-center justify-center w-full p-8">
          <Link
            href={"/services"}
            onClick={() => handleLinkClick("services")}
            className="w-full"
          >
            <button className="px-[3rem] py-3 rounded-3xl w-full text-white bg-[#1F94F3] hover:bg-[#077bda] font-poppins">
              Help Me Study Abroad
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
