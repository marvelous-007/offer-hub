import {  useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { Header } from '@/components/freelancer-search/header';

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

const UserAddLanguagesActiveState = ({ prevStep, nextStep }: any) => {
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

  const handleSaveAndContinue = () => {
    // Here you would save the languages to your state or API
    nextStep();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6">
        <p className="text-sm text-gray-500 mb-2">7/10</p>
        
        <h1 className="text-xl font-semibold mb-2">
          Looking good. Next, tell us which languages you speak.
        </h1>
        
        <p className="text-gray-600 mb-8">
          OfferHub is global, so clients are often interested to know what languages you speak. 
          English is a must, but do you speak any other languages?
        </p>
        
        <div className="mb-8">
          <h2 className="text-sm font-medium mb-4">Language & proficiency</h2>
          
          {/* Language list */}
          <div className="space-y-3">
            {languages.map((language) => (
              <div key={language.id} className={`flex items-center gap-3 ${language.name === 'English' ? "border-b-2 border-gray-300 py-4" : ""}`}>
                {/* Language name */}
                <div className="w-fit">
                  <div className={`border border-gray-300 rounded-full px-3 py-2 flex items-center justify-between w-fit ${language.name === 'English' ? 'bg-gray-100' : ''}`}>
                    <span>{language.name}</span>
                    {language.name === 'English' && (
                      <span className="text-xs ml-1 text-gray-500">(default)</span>
                    )}
                  </div>
                </div>
                
                {/* Level dropdown */}
                <div className="flex items-center space-x-3 flex-1 relative">
                  <button
                    type="button"
                    className="border border-gray-300 rounded-full px-3 py-2 flex items-center justify-between w-fit"
                    onClick={() => setIsLevelDropdownOpen(language.id)}
                    disabled={language.name === 'English'}
                  >
                    <span>{language.level}</span>
                    <ChevronDown size={16} />
                  </button>
                  <button 
                    onClick={() => removeLanguage(language.id)}
                    className="text-gray-400 hover:text-gray-600 disabled:text-gray-400"
                    disabled = {language.name === 'English'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M16 5L15.1327 17.1425C15.0579 18.1891 14.187 19 13.1378 19H4.86224C3.81296 19 2.94208 18.1891 2.86732 17.1425L2 5M7 9V15M11 9V15M12 5V2C12 1.44772 11.5523 1 11 1H7C6.44772 1 6 1.44772 6 2V5M1 5H17" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
                
                {/* Delete button - not for English */}
                  

              </div>
            ))}
          </div>
          
          {/* Add language button */}
          {languages.length < languageOptions.length && (
            <div className="relative mt-4 border-t-2 border-gray-200 pt-4">
              <button
                type="button"
                className="border border-gray-300 rounded-full px-3 py-2 flex items-center justify-between gap-1 text-sm font-medium"
                onClick={() => setIsLanguageDropdownOpen(true)}
              >
                <span className="text-lg mr-1">+</span> Add a language
              </button>
              
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
        <footer className="flex h-32 justify-between items-center bg-[#E7EAF6] p-4 ">

            <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center w-8 h-8 text-xl border border-[#0A1737] rounded-full text-[#0A1737]"
            >
                🠔
            </button>

            <button
                type="button"
                onClick={handleSaveAndContinue}
                className="px-6 py-2 bg-[#0A1737] text-white rounded-full hover:bg-[#06112D] transition"
            >
                Write an Overview
            </button>
        </footer>
    </div>
  );
};

export default UserAddLanguagesActiveState;