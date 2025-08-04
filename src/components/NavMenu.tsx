import { navIcons } from "@/constant/data";

const NavMenu = ({ setShowIcons }: NavMenuProps) => {
  return (
    <nav className="text-white text-[14px] fixed right-[10%] top-14 z-10">
      <ul className="flex flex-col gap-1">
        {navIcons.map((nav) => (
          <li
            key={nav.id}
            onClick={() => setShowIcons(false)}
            className="text-center px-2 py-1 border-b-1 "
          >
            <a href={nav.href} className="hover:text-blue-400">
              {nav.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavMenu;
