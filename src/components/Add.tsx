"use client"
import { IoMdAddCircleOutline } from "react-icons/io";
import { useRouter } from 'next/navigation'

type AddProps = {
    path: string
}

const Add = (props: AddProps)=> {

    const router = useRouter();

    const handleClick = ()=>{
        router.push(props.path);
    };

    return (
        <div 
            onClick={() => handleClick}
        >
            <IoMdAddCircleOutline className="w-20 h-20"/>
        </div>
    )
}

export default Add;