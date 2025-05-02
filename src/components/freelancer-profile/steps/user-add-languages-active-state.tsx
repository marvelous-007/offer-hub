import {  useState, useRef, useEffect } from 'react';
import { ChevronDown, Info, Search, Trash, X } from 'lucide-react';
import Header from "@/components/freelancer-profile/steps/header";

type LanguageLevel = 'Basic' | 'Conversational' | 'Fluent' | 'Native or Bilingual';

type Language = {
  id: string;
  name: string;
  level: LanguageLevel;
};

const languageLevels: LanguageLevel[] = [
  'Basic',
  'Conversational',
  'Fluent',
  'Native or Bilingual'
];

const languageOptions = [
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Russian',
  'Japanese',
  'Chinese',
  'Arabic',
  'Hindi',
  'Italian',
  'Dutch',
  'Korean',
  'Turkish',
  'Swedish',
  'Polish',
  'Vietnamese',
  'Catalan',
  'Valencian',
  // Add more languages as needed
];

const levelDescriptions: Record<LanguageLevel, string> = {
  'Basic': 'I know the basics in this language',
  'Conversational': 'I write and speak clearly in this language',
  'Fluent': 'I write and speak easily in this language',
  'Native or Bilingual': 'I write and speak fluently in this language'
};

const UserAddLanguagesActiveState = () => {
  // Initialize with English as default
  const [languages, setLanguages] = useState<Language[]>([
    { id: '1', name: 'English', level: 'Native or Bilingual' }
  ]);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const levelDropdownRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const filteredLanguages = languageOptions.filter(
    (lang) => lang.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !languages.some((l) => l.name === lang)
  );

  const addLanguage = (langName: string) => {
    if (languages.some(lang => lang.name === langName)) return;
    
    setLanguages([...languages, { 
      id: generateId(), 
      name: langName, 
      level: 'Basic' 
    }]);
    setIsLanguageDropdownOpen(false);
    setSearchQuery('');
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const updateLanguageLevel = (id: string, level: LanguageLevel) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, level } : lang
    ));
    setIsLevelDropdownOpen(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      languageDropdownRef.current && 
      !languageDropdownRef.current.contains(event.target as Node)
    ) {
      setIsLanguageDropdownOpen(false);
    }

    if (
      levelDropdownRef.current && 
      !levelDropdownRef.current.contains(event.target as Node)
    ) {
      setIsLevelDropdownOpen(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#f6f6f6]">
      <Header title="7/10" />
      
      <div className="flex-1 mx-auto max-w-6xl px-4 py-6">
        <div className='w-[65%] space-y-4'>
          <p className="text-2xl text-[#6D758F] mb-2">7/10</p>
          
          <h1 className="text-3xl text-[#002333] font-medium mb-2">
            Looking good. Next, tell us which languages you speak.
          </h1>
          
          <p className="text-[#6D758F] text-xl mb-8">
            OfferHub is global, so clients are often interested to know what languages you speak. 
            English is a must, but do you speak any other languages?
          </p>
        </div>
        
        <div className="w-full my-8 border-t border-[#B4B9C9] pt-4">
          <h2 className="text-2xl text-[#344054] font-medium mb-4 px-3">Add your experience</h2>
          
          {/* Language list */}
          <div className="space-y-3 w-full bg-white px-8 py-4 rounded-xl">
            {languages.map((language) => (
              <div key={language.id} className={`flex items-center gap-3 border-b border-gray-200 last:border-none py-2 pb-4 ${language.name === 'English' ? "" : "w-full"}`}>
                {/* Language name */}
                <div className={`${language.name !== "English" && "w-[50%]"} `}>
                  <div className={` px-3 py-2 flex items-center justify-between  ${language.name === 'English' ? 'flex-col w-fit' : 'border border-gray-200 rounded-xl w-full'}`}>
                    <span>{language.name}</span>
                    {language.name === 'English' && (
                      <span className="text-xs ml-1 text-gray-500">(default)</span>
                    )}
                  </div>
                </div>
                
                {/* Level dropdown */}
                <div className={`flex items-center space-x-3 ${language.name !== "English" && "w-[50%]"} relative`}>
                  <button
                    type="button"
                    className="border border-gray-200 rounded-xl px-3 py-2 flex items-center justify-between w-full"
                    onClick={() => setIsLevelDropdownOpen(language.id)}
                    disabled={language.name === 'English'}
                  >
                    <span>{language.level || "My Level is"}</span>
                    <ChevronDown size={16} />
                  </button>
                  <button 
                    onClick={() => removeLanguage(language.id)}
                    className="border border-[#D5D7DA] p-2 rounded-xl text-gray-400 hover:text-gray-600 disabled:text-gray-400"
                    disabled = {language.name === 'English'}
                  >
                    <Trash />
                  </button>
                  
                  {isLevelDropdownOpen === language.id && (
                    <div 
                      ref={levelDropdownRef}
                      className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg"
                    >
                      <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                        <span className="font-medium">Select language level</span>
                        <button 
                          onClick={() => setIsLevelDropdownOpen(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {languageLevels.map((level) => (
                          <button
                            key={level}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 flex flex-col ${language.level === level ? 'bg-gray-100' : ''}`}
                            onClick={() => updateLanguageLevel(language.id, level)}
                          >
                            <span className="font-medium">{level}</span>
                            <span className="text-sm text-gray-500">{levelDescriptions[level]}</span>
                          </button>
                          
                        ))}
                      </div>
                    </div>
                    
                  )}
                  
                </div>

              </div>
            ))}
          </div>
          
          {/* Add language button */}
          {languages.length < languageOptions.length && (
            <div className="relative mt-2 pt-4">
              <div>
                <button
                  type="button"
                  className="border border-gray-300 rounded-full px-3 py-2 flex items-center justify-between gap-1 text-sm font-medium"
                  onClick={() => setIsLanguageDropdownOpen(true)}
                >
                  <span className="text-lg mr-1">+</span> Add a language
                </button>
                <div className='ml-1 mt-0.5 flex items-center space-x-1 text-xs text-[#6D758F]'>
                  <Info className='h-3 w-3'/>
                  <p>Add at least one item</p>
                </div>
              </div>
              
              {isLanguageDropdownOpen && (
                <div 
                  ref={languageDropdownRef}
                  className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg"
                >
                  <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                    <span className="font-medium">Select language</span>
                    <button 
                      onClick={() => setIsLanguageDropdownOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="p-2 border-b border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full border border-gray-300 rounded pl-9 pr-3 py-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {filteredLanguages.length > 0 ? (
                      filteredLanguages.map((language) => (
                        <button
                          key={language}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-100"
                          onClick={() => addLanguage(language)}
                        >
                          {language}
                        </button>
                      ))
                    ) : (
                      <p className="p-4 text-gray-500 text-center">No languages found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        

      </div>
    </div>
  );
};

export default UserAddLanguagesActiveState;