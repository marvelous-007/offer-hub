import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <p>logo</p>
      <p>itmes header</p>
      <ThemeToggle />
    </header>
  );
};

export default Header;
