import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  logo: string;
  links: { name: string; href: string }[];
  user: {
    name: string;
    profilePicture: string;
  };
}

export default function Navbar({ logo, links, user }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center w-full p-4 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Image src={logo} alt="Logo" width={50} height={50} className="mr-4" />
        <span className="text-lg font-bold">Offer Hub</span>
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-4">
  {links.map((link) => (
    <li key={link.name}>
      <Link
        href={link.href}
        className={`px-4 py-2 rounded-lg ${
          // Aquí se chequea si el link está activo (puedes usar lógica adicional para determinarlo)
          link.isActive
            ? "bg-[#159A9C] text-white" // Botón seleccionado
            : "text-[#159A9C] hover:bg-gray-100 hover:text-[#159A9C]" // Normal y hover
        }`}
      >
        {link.name}
      </Link>
    </li>
  ))}
</ul>


      {/* User Profile */}
      <div className="flex items-center space-x-2">
        <Image
          src={user.profilePicture}
          alt="User Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="text-right">
          <p className="text-sm font-medium">{user.name}</p>
          <button className="text-sm text-gray-500 hover:underline">Sign out</button>
        </div>
      </div>
    </nav>
  );
}
