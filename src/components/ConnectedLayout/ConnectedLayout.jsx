"use client";

import Link from "next/link";
import Footer from "../Footer/Footer";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Buttons/Button/Button";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SearchModal from "../SearchModal/SearchModal";
import { useContext } from "react";
import { ThemeContext } from "@/app/Provider";

export default function ConnectedLayout({ children }) {
  // Variables
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const mode = getCookie("accessMode");
    const guestCookie = getCookie("guest");
    const authCookie = getCookie("__Secure-next-auth.session-token");

    setIsGuest(!!guestCookie);

    if (pathname === "/" || session === undefined) return;

    if (
      !guestCookie &&
      !authCookie &&
      !session?.user?.email &&
      pathname.startsWith("/categories") &&
      pathname !== "/"
    ) {
      if (pathname !== "/") router.replace("/login");
    }
  }, [pathname, session]);

  function exitGuestMode() {
    deleteCookie("guest");
    deleteCookie("accessMode");

    setIsGuest(false);
    router.push("/");
  }

  function handleLogout() {
    toast.success("Déconnexion réussie !", { autoClose: 5000 });

    signOut();

    router.replace("/");
  }

  function DarkModeToggle() {
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

    return (
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="flex items-center gap-2 p-2 rounded-md transition bg-gray-400 text-black hover:bg-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-400"
      >
        {isDarkMode ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 512 512"
            >
              <path
                fill="#FFC639"
                d="m260.622 42.537l58.117-39.696c3.641-2.487 8.643-1.147 10.552 2.828l30.483 63.437a7.2 7.2 0 0 0 7.035 4.062l70.179-5.32c4.397-.333 8.058 3.328 7.725 7.725l-5.32 70.179a7.2 7.2 0 0 0 4.062 7.035l63.437 30.483c3.975 1.91 5.315 6.911 2.828 10.552l-39.696 58.117a7.2 7.2 0 0 0 0 8.123l39.696 58.117c2.487 3.641 1.147 8.643-2.828 10.552l-63.437 30.483a7.2 7.2 0 0 0-4.062 7.035l5.32 70.179c.333 4.397-3.328 8.058-7.725 7.725l-70.179-5.32a7.2 7.2 0 0 0-7.035 4.062l-30.483 63.437c-1.91 3.975-6.911 5.315-10.552 2.828l-58.117-39.696a7.2 7.2 0 0 0-8.123 0l-58.117 39.696c-3.641 2.487-8.643 1.147-10.552-2.828l-30.483-63.437a7.2 7.2 0 0 0-7.035-4.062l-70.179 5.32c-4.397.333-8.058-3.328-7.725-7.725l5.32-70.179a7.2 7.2 0 0 0-4.062-7.035L6.228 328.731c-3.975-1.91-5.315-6.911-2.828-10.552l39.696-58.117a7.2 7.2 0 0 0 0-8.123L3.401 193.821c-2.487-3.641-1.147-8.643 2.828-10.552l63.437-30.483a7.2 7.2 0 0 0 4.062-7.035l-5.32-70.179c-.333-4.397 3.328-8.058 7.725-7.725l70.179 5.32a7.2 7.2 0 0 0 7.035-4.062L183.83 5.668c1.91-3.975 6.911-5.315 10.552-2.828l58.117 39.696a7.2 7.2 0 0 0 8.123.001"
              />
              <circle cx="256.56" cy="256" r="194.415" fill="#FFE564" />
            </svg>
            <span>Mode Clair</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 512 512"
            >
              <path
                fill="#FDE364"
                d="M503.851 210.204C492.563 120.657 434.38 44.485 355.192 7.235c-11.279-5.306-22.337 7.572-15.47 17.982c18.48 28.029 30.919 60.278 35.273 94.838c18.733 148.659-106.281 273.673-254.94 254.94c-34.56-4.354-66.81-16.793-94.839-35.273c-10.41-6.866-23.287 4.191-17.982 15.478c37.25 79.182 113.422 137.364 202.969 148.651c171.226 21.579 315.226-122.414 293.648-293.647"
              />
            </svg>
            <span>Mode Sombre</span>
          </>
        )}
      </button>
    );
  }
  // Regroupe les boutons utilisateur
  const userButtons = () => (
    <>
      {isGuest ? (
        <Button
          onClick={exitGuestMode}
          className="text-[#902124] rounded-xl border border-[#902124] px-4 py-2"
        >
          Quitter mode invité
        </Button>
      ) : session?.user?.email ? (
        <div className="signout-button">
          <Button
            withoutMarginTop
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </div>
      ) : (
        <Link href="/login/signin">
          <Button
            className="bg-[#902124] text-white px-4 py-2 rounded-xl border border-white hover:bg-[#65963E] transition-transform hover:scale-105"
            withoutMarginTop
          >
            Se connecter
          </Button>
        </Link>
      )}
    </>
  );

  // Regroupe les liens de navigation avec SVG
  const navLinks = (
    <>
      {/* Accueil */}
      <li>
        <Link href="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-10 h-10 hover:bg-gray-800 duration-150 p-1 rounded-xl ${
              pathname == "/" ? "text-white" : "text-gray-500"
            }`}
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M224 115.55V208a16 16 0 0 1-16 16h-40a16 16 0 0 1-16-16v-40a8 8 0 0 0-8-8h-32a8 8 0 0 0-8 8v40a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-92.45a16 16 0 0 1 5.17-11.78l80-75.48l.11-.11a16 16 0 0 1 21.53 0a1.14 1.14 0 0 0 .11.11l80 75.48a16 16 0 0 1 5.08 11.78"
            />
          </svg>
        </Link>
      </li>
      <li>
        {/* Recherche */}
        <span
          onClick={() => {
            setIsOpen(true);
            setIsSearchActive(true);
          }}
          className="flex items-center justify-center p-1 rounded-xl duration-150 cursor-pointer hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-10 h-10 ${
              isSearchActive ? "text-white" : "text-gray-500"
            }`}
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M232.49 215.51L185 168a92.12 92.12 0 1 0-17 17l47.53 47.54a12 12 0 0 0 17-17ZM44 112a68 68 0 1 1 68 68a68.07 68.07 0 0 1-68-68"
            />
          </svg>
        </span>
      </li>
      {/* Profil */}
      <li>
        <Link href="/profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-10 h-10 hover:bg-gray-800 duration-150 p-1 rounded-xl ${
              pathname == "/profile" ? "text-white" : "text-gray-500"
            }`}
            viewBox="0 0 20 20"
          >
            <path
              fill="currentColor"
              d="M10 9.25c-2.27 0-2.73-3.44-2.73-3.44C7 4.02 7.82 2 9.97 2c2.16 0 2.98 2.02 2.71 3.81c0 0-.41 3.44-2.68 3.44m0 2.57L12.72 10c2.39 0 4.52 2.33 4.52 4.53v2.49s-3.65 1.13-7.24 1.13c-3.65 0-7.24-1.13-7.24-1.13v-2.49c0-2.25 1.94-4.48 4.47-4.48z"
            />
          </svg>
        </Link>
      </li>
    </>
  );

  return (
    <section className="flex flex-col min-h-screen mt-20 w-full">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-[#7EAF50] text-white shadow-lg z-20">
        {/* Logo */}
        <div className="relative w-[350px] h-[60px] flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Logo frigo-magique"
            fill
            className="object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex flex-grow justify-center">
          <ul className="flex gap-6">{navLinks}</ul>
        </nav>

        {/* Zone utilisateur affichée uniquement sur grand écran */}
        <div className="hidden lg:flex items-center gap-4 min-w-[250px] justify-end w-[350px]">
          <DarkModeToggle />
          {status === "loading" ? null : userButtons()}{" "}
        </div>

        {/* Menu Burger pour mobile */}
        <div className="relative group lg:hidden">
          <Button className="block  p-2 rounded-md border text-white cursor-pointer focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8M40 72h176a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16m176 112H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16"
              />
            </svg>
          </Button>

          {/* Menu déroulant */}
          <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md p-4 hidden group-focus-within:block">
            <ul className="flex flex-col items-center justify-center gap-4">
              {navLinks}
            </ul>
            <div className="mt-4 flex flex-col items-center gap-2 menu-dropdown">
              {userButtons(true)}
            </div>
          </div>
        </div>
      </header>

      {isOpen && (
        <SearchModal
          closeModal={() => {
            setIsOpen(false);
            setIsSearchActive(false);
          }}
        />
      )}

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <Footer />
    </section>
  );
}
