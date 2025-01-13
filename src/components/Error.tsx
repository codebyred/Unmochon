import BackButton from "./button/BackButton"

type ErrorProps = {
    message: string
}

const Error = (props: ErrorProps)=>{
    return <div className="flex flex-col grow"> 
        <div className="grow flex justify-between mb-4">
            <BackButton/>
            <div>

            </div>
        </div>
        <div className="flex flex-col items-center justify-center">
            <label className="text-4xl text-red-500">Error</label>
            {props.message}
        </div>  
    </div>
}

export default Error