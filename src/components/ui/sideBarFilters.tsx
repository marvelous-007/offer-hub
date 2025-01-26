"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { X, Check, Plus } from "lucide-react";

export default function SidebarFilters() {
  const allKeywords = ["Spring", "Smart", "Modern", "Summer", "Winter"];
  const [keywords, setKeywords] = useState(["Spring", "Smart", "Modern"]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [checkedLabels, setCheckedLabels] = useState<string[]>([]);
  const [checkedColors, setCheckedColors] = useState<string[]>([]);
  const [checkedSizes, setCheckedSizes] = useState<string[]>([]);
  const colors = ["Red", "Blue", "Green"];
  const sizes = ["Small", "Medium", "Large"];
  const labels = ["Label1", "Label2", "Label3"];

  const updatePriceRange = (value: [number, number]) => {
    setPriceRange(value);
  };

  return (
    <Card className="w-[280px] p-6 border rounded-lg">
      {/* Keywords Section */}
      <div className="mb-6">
        <h3 className="text-base font-medium mb-2">Keywords</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {keywords.map((keyword) => (
            <Badge
              key={keyword}
              variant="secondary"
              className="bg-[#DEEFE7] text-[#002333] px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium"
            >
              {keyword}
              <X
                className="h-3 w-3 cursor-pointer text-[#002333]"
                onClick={() =>
                  setKeywords((prev) => prev.filter((k) => k !== keyword))
                }
              />
            </Badge>
          ))}
        </div>

        {/* Deselected Keywords */}
        <div className="flex flex-wrap gap-2">
          {allKeywords
            .filter((keyword) => !keywords.includes(keyword))
            .map((keyword) => (
              <Badge
                key={keyword}
                variant="secondary"
                className="bg-[#B4BEC9] text-[#002333] px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer text-sm font-medium"
                onClick={() => setKeywords((prev) => [...prev, keyword])}
              >
                {keyword}
                <Plus className="h-3 w-3 text-[#002333]" />
              </Badge>
            ))}
        </div>
      </div>

      {/* Labels Section */}
      <div className="mb-6">
        {labels.map((label, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Checkbox
              id={`label-${index}`}
              checked={checkedLabels.includes(label)}
              onCheckedChange={(checked) => {
                const updatedLabels = checked
                  ? [...checkedLabels, label]
                  : checkedLabels.filter((l) => l !== label);
                setCheckedLabels(updatedLabels);
              }}
            />
            <div>
              <label
                htmlFor={`label-${index}`}
                className="text-sm font-medium text-[#002333]"
              >
                {label}
              </label>
              <p className="text-sm text-[#B4BEC9]">Description</p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Range Section */}
      <div className="mb-6">
        <h3 className="text-base font-medium mb-2 text-[#002333]">
          Price Range
        </h3>
        <Slider
          value={priceRange}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setPriceRange(value)}
          className="mt-4"
        />
        <div className="flex justify-between mt-1 text-[#002333]">
          <span className="text-sm">${priceRange[0]}</span>
          <span className="text-sm">${priceRange[1]}</span>
        </div>
      </div>

      {/* Color Section */}
      <div className="mb-6">
        <h3 className="text-base font-medium mb-2 text-[#002333]">Color</h3>
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Checkbox
              id={`color-${index}`}
              checked={checkedColors.includes(color)}
              onCheckedChange={(checked) => {
                const updatedColors = checked
                  ? [...checkedColors, color]
                  : checkedColors.filter((c) => c !== color);
                setCheckedColors(updatedColors);
              }}
            />
            <label
              htmlFor={`color-${index}`}
              className="text-sm text-[#002333]"
            >
              {color}
            </label>
          </div>
        ))}
      </div>

      {/* Size Section */}
      <div>
        <h3 className="text-base font-medium mb-2 text-[#002333]">Size</h3>
        {sizes.map((size, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Checkbox
              id={`size-${index}`}
              checked={checkedSizes.includes(size)}
              onCheckedChange={(checked) => {
                const updatedSizes = checked
                  ? [...checkedSizes, size]
                  : checkedSizes.filter((s) => s !== size);
                setCheckedSizes(updatedSizes);
              }}
            />
            <label htmlFor={`size-${index}`} className="text-sm text-[#002333]">
              {size}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
}
