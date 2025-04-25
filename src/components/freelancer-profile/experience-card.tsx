import { Button } from '@/components/ui/button'
import { Edit3Icon, Trash2Icon } from "lucide-react"
import { Experience } from '@/app/types/freelancer-profile'

const ExperienceCard = ({
  title,
  company,
  location,
  country,
  currentlyWorking,
  startDateMonth,
  startDateYear,
  endDateMonth,
  endDateYear,
  description,
}: Experience) => {
  const duration = currentlyWorking ?
    `${startDateMonth} ${startDateYear} - Present` :
    `${startDateMonth} ${startDateYear} - ${endDateMonth} ${endDateYear}`

  return (
    <div
      className='bg-[#F1F3F7] border border-[#6D758F] text-[#6D758F]
      p-4 rounded-xl space-y-4'>
      <section>
        <h4 className='text-xl font-semibold text-[#344054]'>{title}</h4>
        <p>{company} | {duration}</p>
        <p>{location}, {country}</p>
        <p className='text-xs font-normal mt-4'>{description}</p>
      </section>

      <section className='space-x-4'>
        <Button
          onClick={()=> {}}
          variant="outline" className='gap-1 border-[#149A9B] bg-transparent rounded-full mt-4'>
          <Edit3Icon size={18} /> Edit
        </Button>
        <Button
          onClick={()=> {}}
          variant="outline" className='gap-1 border-[#149A9B] bg-transparent rounded-full mt-4'>
          <Trash2Icon size={18} /> Delete
        </Button>
      </section>
    </div>
  )
}

export default ExperienceCard