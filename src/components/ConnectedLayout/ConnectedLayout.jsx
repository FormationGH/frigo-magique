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

export default function ConnectedLayout({ children }) {
  // Variables
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    router.push("/");
  }

  function handleLogout() {
    toast.success("Déconnexion réussie !", { autoClose: 5000 });

    signOut();

    router.replace("/");
  }

  // Regroupe les boutons utilisateur
  const userButtons = () => (
    <>
      {isGuest && (
        <Button
          onClick={exitGuestMode}
          className="text-[#902124] rounded-xl border border-[#902124] px-4 py-2"
        >
          Quitter mode invité
        </Button>
      )}
      {session?.user?.email ? (
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
          <Button withoutMarginTop>Se connecter</Button>
        </Link>
      )}
    </>
  );

  // Regroupe les liens de navigation avec SVG
  const navLinks = (
    <>
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
        <button
          onClick={() => setIsOpen(true)}
          className="p-1 rounded-xl hover:bg-gray-800 duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-10 h-10 text-gray-500`}
            viewBox="0 0 256 256"
          >
            <path
              fill="currentColor"
              d="M232.49 215.51L185 168a92.12 92.12 0 1 0-17 17l47.53 47.54a12 12 0 0 0 17-17ZM44 112a68 68 0 1 1 68 68a68.07 68.07 0 0 1-68-68"
            />
          </svg>
        </button>
      </li>

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
          {userButtons(false)}
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

      {isOpen && <SearchModal closeModal={() => setIsOpen(false)} />}

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <Footer />
    </section>
  );
}
