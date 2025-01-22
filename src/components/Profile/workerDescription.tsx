import Image from "next/image";
import './workerDescription.css';

export default function WorkerDescription() {
  return (
    <div className="grid">
      <header className="header">
        <div className="headerRow">
          {}
          <div className="stars">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
          {}
          <span className="rating">5.0</span>
          <span className="reviews">+ 6,500 reviews</span>
          {}
          <Image
            src="/icons/italy.png"
            alt="Italy flag"
            width={20}
            height={20}
            className="flag"
          />
          <span className="country">Italy</span>
          {}
          <div className="priceContainer">
            <span className="time">(9:55pm)</span> {}
            <Image
              src="/icons/dollar.png"
              alt="Dollar sign"
              width={16}
              height={16}
              className="dollarIcon"
            />
            <span className="price">
              <strong>20.00</strong> per job
            </span>
          </div>
        </div>
      </header>

      {}
      <div className="title">
        <h2>Freelance Graphic Designer | Creativity and Functionality in Every Project</h2>
        <p>
        Hi, I’m Josh Johnson, a graphic designer with over 3 years of experience transforming ideas into impactful visual designs. I specialize in branding, web design, illustration. My approach combines creativity, attention to detail, and effective communication to ensure every project exceeds client expectations. If you're looking for a design that connects with your audience and stands out, I’m the designer for you!
        </p>
      </div>

    </div>
  );
}
