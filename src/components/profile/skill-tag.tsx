"use client";

import React, { useState } from "react";
import {
  GripVertical,
  Star,
  Award,
  Target,
  ChevronDown,
  X,
  TrendingUp,
} from "lucide-react";


import { skillCategories } from "../../data/skills-categories";
import type { Skill } from "../../data/skills-categories";


export const SkillTag: React.FC<{
  skill: Skill;
  onRemove: (id: string) => void;
  onLevelChange: (id: string, level: Skill["level"]) => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}> = ({ skill, onRemove, onLevelChange, isDragging, dragHandleProps }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  const category = skillCategories.find((cat) => cat.id === skill.category);
  const levelColors = {
    Beginner: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Intermediate: "bg-blue-100 text-blue-800 border-blue-300",
    Advanced: "bg-green-100 text-green-800 border-green-300",
  };

  const levelIcons = {
    Beginner: Star,
    Intermediate: Award,
    Advanced: Target,
  };

  const LevelIcon = levelIcons[skill.level];

  return (
    <div
      className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all duration-200 ${
        isDragging
          ? "shadow-lg scale-105 bg-white border-blue-300"
          : `${
              category?.color || "bg-gray-500"
            } bg-opacity-10 border-gray-200 hover:border-gray-300 hover:shadow-md`
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-3 h-3 text-gray-400" />
      </div>

      <div className="flex items-center gap-2">
        {category && <category.icon className="w-4 h-4" />}
        <span className="font-medium text-gray-800">{skill.name}</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowLevelSelector(!showLevelSelector)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
            levelColors[skill.level]
          }`}
        >
          <LevelIcon className="w-3 h-3" />
          <span>{skill.level}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {showLevelSelector && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
            {(["Beginner", "Intermediate", "Advanced"] as const).map(
              (level) => {
                const Icon = levelIcons[level];
                return (
                  <button
                    key={level}
                    onClick={() => {
                      onLevelChange(skill.id, level);
                      setShowLevelSelector(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      skill.level === level
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="text-sm">{level}</span>
                  </button>
                );
              }
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => onRemove(skill.id)}
        className={`transition-opacity ${
          isHovered ? "opacity-100" : "opacity-0"
        } hover:text-red-500`}
      >
        <X className="w-4 h-4" />
      </button>

      {skill.demand && (
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            skill.demand === "High"
              ? "bg-red-100 text-red-700"
              : skill.demand === "Medium"
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <TrendingUp className="w-3 h-3 inline mr-1" />
          {skill.demand}
        </div>
      )}
    </div>
  );
};
