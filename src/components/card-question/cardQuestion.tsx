import React from "react";

interface CardQuestionProps {
  icon: React.ReactNode;
  title: string;
  questions: string[];
}

const CardQuestion: React.FC<CardQuestionProps> = ({ icon, title, questions }) => {
  return (
    <div className="rounded-lg shadow-md p-4 bg-card text-card-foreground">
      <div className="flex items-center mb-4">
        <span className="text-xl mr-2">{icon}</span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <ul className="list-none space-y-2">
        {questions.map((question, index) => (
          <li key={index}>
            <a
              href="#"
              className="text-primary-500 no-underline hover:text-primary-400"
              aria-label={question}
            >
              {question}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CardQuestion;
