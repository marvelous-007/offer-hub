import { Button } from "@/components/ui/button"
 
export default function ButtonForm () {
    return (
        <Button
        type="submit"
        className="w-2/4 py-2 px-4 bg-teal-500 text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-full"
      >
        Save
      </Button>
    )
}