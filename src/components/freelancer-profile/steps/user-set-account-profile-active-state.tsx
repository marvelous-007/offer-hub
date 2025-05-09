'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function UserSetAccountProfileActiveState() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        country: '',
        streetAddress: '',
        aptSuite: '',
        city: '',
        stateProvince: '',
        zipPostalCode: '',
        phoneNumber: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAttachPhoto = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-2">10/10</p>
                <h1 className="text-3xl font-bold text-[#19213D] mb-4">
                    A few last details, then you can check and publish your profile.
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                    Now, let’s set your hourly rate. Clients will see this rate on your profile and in search results once you
                    publish your profile. You can adjust your rate every time you submit a proposal.
                </p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-8">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>

                    <DialogTrigger asChild>
                        <div className="relative group cursor-pointer">
                            {profileImage ? (
                                <Image
                                    src={profileImage}
                                    alt="Profile Photo"
                                    width={150}
                                    height={150}
                                    className="rounded-full object-cover border-2 border-gray-300 bg-[#D9D9D9]"
                                />
                            ) : (
                                <div className="w-36 h-36 rounded-full bg-[#D9D9D9] flex items-center justify-center">

                                </div>
                            )}

                            {!profileImage && (
                                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                                    <PlusCircle className="h-6 w-6 text-white" />
                                </div>
                            )}
                        </div>
                    </DialogTrigger>

                    <DialogTrigger asChild>
                        <Button variant="outline">Upload Profile Photo</Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogTitle>Upload Profile Photo</DialogTitle> 

                        <div className="flex flex-col items-center gap-4">
                            <p className="text-center">Drag and drop or click to upload a profile photo (Minimum 250x250)</p>

                            {/* Custom file input */}
                            <Input type="file" accept="image/*" onChange={handleImageChange} />

                            <div className="text-center mt-4">
                                <p className="font-semibold">Must be an actual photo of you.</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Logos, Clip-art, group photos, and digitally-altered images are not allowed.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <DialogFooter className="mt-6 flex justify-between">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAttachPhoto}>
                                Attach Photo
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="flex flex-col">
                    <Label className="mb-2">Date of Birth*</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full text-left font-normal rounded-[16px]",
                                    !dateOfBirth && "text-muted-foreground"
                                )}
                            >
                                {dateOfBirth ? format(dateOfBirth, 'PPP') : 'Select your date of birth'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                selected={dateOfBirth}
                                onSelect={(date) => setDateOfBirth(date)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div>
                    <Label>Country*</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, country: value })}>
                        <SelectTrigger className="rounded-[16px]">
                            <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="mexico">Mexico</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <Label>Street Address*</Label>
                    <Input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} />
                </div>

                <div className="col-span-1 md:col-span-2">
                    <Label>APT/Suite (Optional)</Label>
                    <Input type="text" name="aptSuite" value={formData.aptSuite} onChange={handleChange} />
                </div>

                <div>
                    <Label>City*</Label>
                    <Input type="text" name="city" value={formData.city} onChange={handleChange} />
                </div>

                <div>
                    <Label>State/Province*</Label>
                    <Input type="text" name="stateProvince" value={formData.stateProvince} onChange={handleChange} />
                </div>

                <div>
                    <Label>Zip/Postal Code*</Label>
                    <Input type="text" name="zipPostalCode" value={formData.zipPostalCode} onChange={handleChange} />
                </div>

                <div>
                    <Label>Phone Number</Label>
                    <Input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+1 123 456 7890" />
                </div>
            </form>
        </div>
    );
}
