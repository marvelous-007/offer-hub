import Image from "next/image";

export default function WorkerDescription({
  stars = 5,
  rating = "5.0",
  reviews = "+ 6,500 reviews",
  country = "Italy",
  flagSrc = "/icons/italy.png",
  time = "(9:55pm)",
  price = "20.00",
  title = "Freelance Graphic Designer | Creativity and Functionality in Every Project",
  description = "Hi, I’m Josh Johnson, a graphic designer with over 3 years of experience transforming ideas into impactful visual designs. I specialize in branding, web design, illustration. My approach combines creativity, attention to detail, and effective communication to ensure every project exceeds client expectations. If you're looking for a design that connects with your audience and stands out, I’m the designer for you!",
}) {
  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr] items-start justify-items-start gap-10 bg-white px-4 py-10 sm:py-24 font-sans">
      <header className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-8 text-left">
          <div className="flex gap-2 text-yellow-400 text-2xl">
            {[...Array(stars)].map((_, index) => (
              <span key={index}>★</span>
            ))}
          </div>
          <span className="text-lg text-black">{rating}</span>
          <span className="text-lg text-black mr-4">{reviews}</span>
          <Image
            src={flagSrc}
            alt={`${country} flag`}
            width={20}
            height={20}
            className="rounded-full ml-4"
          />
          <span className="text-xl text-black">{country}</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg text-black mr-4">{time}</span>
            <Image
              src="/icons/dollar.png"
              alt="Dollar sign"
              width={16}
              height={16}
              className="w-5 h-5 mr-2"
            />
            <span className="text-xl text-black font-bold">
              <strong>{price}</strong> per job
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl">
        <h2 className="text-xl font-bold text-black">{title}</h2>
        <p className="mt-4 text-lg text-black">{description}</p>
      </div>
    </div>
  );
}
