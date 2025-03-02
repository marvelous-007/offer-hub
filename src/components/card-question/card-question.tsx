import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CardQuestionProps {
  icon: React.ReactNode;
  title: string;
  questions: string[];
}

const CardQuestion: React.FC<CardQuestionProps> = ({ icon, title, questions }) => {
  return (
    <Card className="w-full max-w-3xl p-6 bg-card text-card-foreground">
      <CardHeader className="flex items-start gap-4">
        <span className="text-2xl flex items-center justify-center">
          {icon}
        </span>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-none mt1 space-y-2">
          {questions.map((question, index) => (
            <li key={index}>
              <a
                href="#"
                className="text-primary-600 hover:text-primary-700 no-underline"
                aria-label={question}
              >
                {question}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default CardQuestion;
