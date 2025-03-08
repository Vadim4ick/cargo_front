import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">🚚</span> Акос
        </Link>

        {/* Навигация */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-300 transition">
            Главная
          </Link>
          <Link href="/users" className="hover:text-blue-300 transition">
            Пользователи
          </Link>
        </div>

        {/* Мобильное меню (гамбургер) */}
        <div className="md:hidden">
          <button className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
