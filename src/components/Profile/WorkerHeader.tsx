import Image from "next/image";

// Images
import WorkerBannerImage from '@/assets/img/workerBanner.svg';
import WorkerProfileImage from '@/assets/img/workerProfile.svg';
import VerifiedIcon from '@/assets/img/verifiedIcon.svg';

// Icons
import HireIcon from '@/assets/img/hireIcon.svg';
import ShareIcon from '@/assets/img/shareIcon.svg';
import OptionsIcon from '@/assets/img/optionsIcon.svg'

export default function WorkerHeader() {
    return (
        <div className="mx-10">
            <div className="bg-[#ffffff]">
                {/* Banner */}
                <div className="h-48 bg-cover bg-center rounded-t-lg">
                    <Image
                        src={WorkerBannerImage}
                        alt="Banner"
                        width={1597}
                        height={284}
                    />
                </div>

                {/* Contenedor de información */}
                <div className="relative flex items-center px-7">
                    {/* Foto de perfil */}
                    <div className="rounded-full overflow-hidden mt-[-115px]">
                        <Image
                            src={WorkerProfileImage}
                            alt="Perfil"
                            width={252}
                            height={252}
                        />
                    </div>

                    {/* Detalles del perfil */}
                    <div className="ml-6">
                        {/* Nombre y verificación */}
                        <div className="flex items-center mt-[63px]">
                            <h2 className="text-[64px] font-inter mr-[2rem] text-[#000000]">Josh Johnson</h2>
                            <Image
                                src={VerifiedIcon}
                                alt="Verified"
                                width={52}
                                height={56}
                            />
                        </div>
                        {/* Rol */}
                        <p className="text-[#656464] font-Inter text-[24px] mt-[-15px] mb-[10px]">Designer</p>
                    </div>

                    {/* Botones de acción */}
                    <div className="ml-auto flex items-center gap-6 mt-5">
                        {/* Botón de más opciones */}
                        <button className="flex items-center justify-center w-10 h-10 rounded-full hover">
                            <Image
                                src={OptionsIcon}
                                alt="Options"
                                width={25}
                                height={7}
                            />
                        </button>

                        {/* Botón de compartir */}
                        <button className="flex items-center justify-center w-10 h-10 rounded-full hover">
                            <Image
                                src={ShareIcon}
                                alt="Share"
                                width={40}
                                height={40}
                            />
                        </button>

                        {/* Botón de contratar */}
                        <button className="px-7 py-2 rounded-full bg-[#159A9C] text-white hover">
                            <Image
                                src={HireIcon}
                                alt="Hire"
                                width={90}
                                height={50}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}