"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react"
import Footer from '@/components/freelancer-profile/footer'
import { useFreelancerSteps } from '@/hooks/use-freelancer-steps'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Type for education item
type EducationItem = {
  id: string;
  university: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
  location: string;
  description: string;
}

function UserAddEducationActiveState() {
  const { nextStep, prevStep } = useFreelancerSteps()
  
  // State for education items
  const [educationItems, setEducationItems] = useState<EducationItem[]>([
    {
      id: '1',
      university: 'Northwestern University',
      degree: 'Bachelor of Science(BSC)',
      fieldOfStudy: 'Computer Sci',
      startYear: 2021,
      endYear: 2024,
      location: 'USA, New Jersey',
      description: 'This is your job experience description section. Lorem ipsum.'
    }
  ]);
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State for form data
  const [formData, setFormData] = useState<Omit<EducationItem, 'id'>>({ 
    university: '',
    degree: '',
    fieldOfStudy: '',
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear(),
    location: '',
    description: ''
  });
  
  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'startYear' || name === 'endYear' ? Number(value) : value
    }));
  };
  
  // Function to add a new education item
  const addEducation = () => {
    setEditingId(null);
    setFormData({ 
      university: '',
      degree: '',
      fieldOfStudy: '',
      startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear(),
      location: '',
      description: ''
    });
    setIsModalOpen(true);
  };
  
  // Function to save education data
  const saveEducation = () => {
    if (editingId) {
      // Update existing education item
      setEducationItems(prev => 
        prev.map(item => 
          item.id === editingId ? { ...formData, id: editingId } : item
        )
      );
    } else {
      // Add new education item with unique ID
      const newId = Date.now().toString();
      setEducationItems(prev => [...prev, { ...formData, id: newId }]);
    }
    
    // Close modal after saving
    setIsModalOpen(false);
    setEditingId(null);
  };
  
  // Function to edit an education item
  const editEducation = (id: string) => {
    const itemToEdit = educationItems.find(item => item.id === id);
    if (itemToEdit) {
      setEditingId(id);
      setFormData({
        university: itemToEdit.university,
        degree: itemToEdit.degree,
        fieldOfStudy: itemToEdit.fieldOfStudy,
        startYear: itemToEdit.startYear,
        endYear: itemToEdit.endYear,
        location: itemToEdit.location,
        description: itemToEdit.description
      });
      setIsModalOpen(true);
    }
  };
  
  // Function to delete an education item
  const deleteEducation = (id: string) => {
    setEducationItems(educationItems.filter(item => item.id !== id));
  };
  
  // Function to handle form submission and proceed to next step
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save data and proceed to next step
    nextStep();
  };

  return (
    <div className='flex flex-col gap-y-8 w-full pt-8 bg-[#f6f6f6]'>
      <div className="gap-4 mx-auto px-4 w-full max-w-4xl">
        <p className="text-neutral-500 font-semibold">6/10</p>
        <h1 className="text-4xl font-semibold text-[#19213D]">
          Client like to know what you know add your education here.
        </h1>
        <p className="text-xl text-[#19213D] mt-2">
          You don't have to have a degree. Adding any relevant education helps make your profile more visible.
        </p>
        <hr className="my-6" />
        <div className="mt-6">
          <h2 className="text-lg mb-4">Add your experience</h2>
          
          {/* Education cards */}
          <div className="space-y-4 w-[70%]">
            {educationItems.map((item) => (
              <div key={item.id} className="border border-[#6D758F] rounded-lg p-4 bg-[#F1F3F7]">
                <div className="mb-2">
                  <h3 className="font-semibold">{item.university}</h3>
                  <p className="text-sm">{item.degree} || {item.fieldOfStudy} || {item.startYear} - {item.endYear}</p>
                  <p className="text-sm text-gray-500">{item.location}</p>
                  <p className="text-sm text-gray-400 mt-2">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs flex items-center gap-1 rounded-full bg-[#F1F3F7] border-[#149A9B] text-[#149A9B]"
                    onClick={() => editEducation(item.id)}
                  >
                    <Pencil size={14} /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs flex items-center gap-1 rounded-full bg-[#F1F3F7] border-[#149A9B] text-[#149A9B]"
                    onClick={() => deleteEducation(item.id)}
                  >
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add Education button */}
          <Button 
            onClick={addEducation} 
            className="mt-4 bg-[#149A9B] text-white flex items-center gap-2 rounded-full"
          >
            <Plus size={18} /> Add Education
          </Button>
          
          <p className={cn(
            "text-xs text-gray-500 mt-2", 
            educationItems.length > 0 ? "" : "text-red-500 font-medium"
          )}>
            Add at least one item
          </p>
        </div>
      </div>
      
      {/* Education Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Education" : "Add Education"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="university">University / Institution</Label>
                <Input 
                  id="university" 
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  placeholder="e.g. Harvard University"
                />
              </div>
              
              <div>
                <Label htmlFor="degree">Degree</Label>
                <Input 
                  id="degree" 
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g. Bachelor of Science (BSc)"
                />
              </div>
              
              <div>
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input 
                  id="fieldOfStudy" 
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input 
                    id="startYear" 
                    name="startYear"
                    type="number"
                    value={formData.startYear}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endYear">End Year</Label>
                  <Input 
                    id="endYear" 
                    name="endYear"
                    type="number"
                    value={formData.endYear}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Boston, MA, USA"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your education experience..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button 
              onClick={saveEducation}
              className="rounded-full bg-[#149A9B] text-white"
            >
              {editingId ? "Save Changes" : "Add Education"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer className='px-4 mt-auto flex justify-between'>
        <div>
          <Button
            onClick={prevStep}
            variant="ghost" 
            className='gap-1 rounded-full'
          >
            <ArrowLeft size={18} /> Back
          </Button>
        </div>

        <div className='space-x-4'>
          <Button
            onClick={nextStep}
            variant="outline"
            className='border-[#149A9B] text-[#149A9B] hover:text-[#149A9B]
            bg-transparent rounded-full md:min-w-36'
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            className='gap-1 bg-[#149A9B] text-white rounded-full md:min-w-36'
            disabled={educationItems.length === 0}
          >
            Add Education
          </Button>
        </div>
      </Footer>
    </div>
  )
}

export default UserAddEducationActiveState
