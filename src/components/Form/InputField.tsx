import { Input } from "@/components/ui/input"

const InputField = ({type="", placeholder="", className="", ...props}) => {
    return (
        <Input
        type={type} 
        placeholder={placeholder} 
        className={`w-full px-3 py-2 bg-inputBackground rounded-full ${className}`}
        {...props} 
      />
    )
}

export default InputField;