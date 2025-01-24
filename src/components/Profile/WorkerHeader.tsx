'use client';

import Image from "next/image";

import verifiedIcon from '@/assets/img/verifiedIcon.svg'
import shareIcon from '@/assets/img/shareIcon.svg'
import hireIcon from '@/assets/img/hireIcon.svg'
import optionsIcon from '@/assets/img/optionsIcon.svg'

interface WorkerHeaderProps {
  bannerImage: string;
  profileImage: string;
  name: string;
  role: string;
  isVerified?: boolean;
  onHire?: () => void;
  onShare?: () => void;
  onOptions?: () => void;
}

export default function WorkerHeader({
  bannerImage,
  profileImage,
  name,
  role,
  isVerified = false,
  onHire = () => { },
  onShare = () => { },
  onOptions = () => { },
}: WorkerHeaderProps) {
  return (
    <div className="mx-4 md:mx-10">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Banner Image */}
        <div className="h-32 md:h-48 bg-cover bg-center">
          <Image
            src={bannerImage}
            alt="Banner"
            width={1597}
            height={284}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile and Details Section */}
        <div className="relative flex flex-col items-center md:flex-row px-4 md:px-7 pb-6 md:pb-10">

          {/* Profile Image */}
          <div className="rounded-full overflow-hidden -mt-12 md:-mt-24">
            <Image
              src={profileImage}
              alt="Profile"
              width={252}
              height={252}
              className="w-24 h-24 md:w-48 md:h-48 object-cover border-4 border-white"
            />
          </div>

          {/* Name and Role */}
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <h2 className="text-xl md:text-4xl font-semibold text-black leading-tight">
                {name}
              </h2>
              {isVerified && (
                <Image
                  src={verifiedIcon}
                  alt="Verified"
                  width={26}
                  height={28}
                  className="w-6 h-6 md:w-8 md:h-8 ml-2 mt-2"
                />
              )}
            </div>
            <p className="text-gray-600 text-sm md:text-lg mt-2">
              {role}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 md:mt-0 md:ml-auto flex items-center justify-center gap-4 md:gap-[35px]">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200"
              onClick={onOptions}
            >
              <Image
                src={optionsIcon}
                alt="Options"
                width={20}
                height={5}
                className="w-5 h-1 md:w-[25px] md:h-[7px]"
              />
            </button>
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200"
              onClick={onShare}
            >
              <Image
                src={shareIcon}
                alt="Share"
                width={30}
                height={30}
                className="w-6 h-6 md:w-[40px] md:h-[40px]"
              />
            </button>
            <button
              className="px-4 py-2 bg-[#159A9C] text-white text-sm rounded-full hover:bg-[#0e7a7b] flex items-center gap-2"
              onClick={onHire}
            >
              <Image
                src={hireIcon}
                alt="Hire"
                width={18}
                height={18}
                className="w-[15px] h-[15px] md:w-[30px] md:h-[30px]"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}