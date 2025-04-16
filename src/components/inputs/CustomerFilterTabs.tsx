'use client'

const CustomerFilterTabs = ({selected, setSelected}:{selected:string, setSelected:(value:string) => void;}) => {

    const options = ['ALL', 'TODAY', 'UNPAID'];

    return (
        <div className="inline-flex border border-[#004aad] rounded-lg overflow-hidden max-sm:text-[10px] text-sm font-medium">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={`px-4 py-2 transition-colors duration-200 cursor-pointer
              ${selected === option
                            ? 'bg-[#004aad] text-white'
                            : 'bg-white text-[#004aad] hover:bg-blue-100'
                        }
              ${option !== options[0] ? 'border-l border-[#004aad]' : ''}
            `}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default CustomerFilterTabs;