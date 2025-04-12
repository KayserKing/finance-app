interface ButtonProps {
    name: string;
    className?: string;
    handleClick?: () => void;
    type: 'button' | 'reset' | 'submit';
}

const Button = ({ name, className, handleClick, type }: ButtonProps) => {
    return (
        <button
            type={type}
            className={`${className} bg-[#004aad] text-white font-bold py-2 cursor-pointer hover:opacity-90`}
            onClick={handleClick}
        >
            {name}
        </button>
    )
}

export default Button;