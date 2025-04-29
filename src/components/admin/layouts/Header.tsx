import Image from "next/image";

export default function Header() {
  return (
    <div className="flex items-center justify-between border-b p-6">
      <h2 className="text-xl font-medium">Good Morning John Doe</h2>
      <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
        <Image src="/profile.jpeg" alt="User avatar" width={40} height={40} />
      </div>
    </div>
  );
}
