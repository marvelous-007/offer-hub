import Image from "next/image";
import ProfileForm from "../ui/form/ProfileForm";
import Link from "next/link";

const UserProfile = () => {
  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex flex-col md:flex-row px-0 md:px-10 w-full gap-5 justify-between items-center">
        <Image alt="user profile" width={150} height={150} src="/profile.svg" />

        <div className="flex flex-row md:flex-col gap-3">
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            <Image
              src="/social-networks/linkedin.svg"
              alt="LinkedIn"
              width={40}
              height={40}
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            <Image
              src="/social-networks/x.svg"
              alt="X"
              width={40}
              height={40}
            />
          </Link>
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            <Image
              src="/social-networks/telegram.svg"
              alt="Telegram"
              width={37}
              height={37}
            />
          </Link>
        </div>

        <div className="flex p-5 rounded-xl w-full md:w-5/6 bg-primary-50 dark:bg-gray-800 text-sm">
          Freelance Software Developer <br />
          January 2023 - Present Developed <br />
          <br />
          Customized business solutions, including CRM systems and chatbots,
          focusing on scalability and user experience. Integrated emerging
          technologies such as blockchain and smart contracts into projects,
          ensuring security and functionality. Delivered technical training to
          clients, improving operational efficiency and reducing process times.
        </div>
      </div>

      <div className="flex px-0 md:px-10 w-full gap-5 justify-between items-center">
        <ProfileForm />
      </div>
    </div>
  );
};

export default UserProfile;
