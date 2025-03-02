import Header from "@/components/layout/header";

interface layoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: layoutProps) => {
  return (
    <div className="flex flex-col h-min-screen gap-5">
      <Header />
      {children}
    </div>
  );
};

export default layout;
