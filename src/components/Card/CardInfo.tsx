import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";

interface CardInfoProps {
    title: string;
    imageOrIcon: React.ReactNode | string;
    altText?: string;
    content: {
      title: string;
      description: string;
      info: string;
    };
  }
  
  export function CardInfo({ title, imageOrIcon, altText, content }: CardInfoProps) {
    return (
      <Card className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 lg:gap-20 p-4">
        <Avatar className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex-shrink-0">
          {typeof imageOrIcon === "string" ? (
            <AvatarImage
              src={imageOrIcon}
              alt={altText || "Image"}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <>{imageOrIcon}</>
          )}
        </Avatar>
        <CardContent className="flex flex-col justify-center items-center md:items-start max-w-xl gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <article className="flex flex-col justify-start items-start bg-[#DEEFE7] p-6 rounded-2xl w-full">
            <h3 className="text-lg font-bold text-[#0F6F99]">{content.title}</h3>
            <p className="text-sm text-[#0F6F99] mt-2">{content.description}</p>
            <p className="text-sm text-[#0F6F99] mt-2">{content.info}</p>
          </article>
        </CardContent>
      </Card>
    );
  }