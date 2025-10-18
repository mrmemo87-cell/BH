
import React from 'react';
import { CheckIcon } from './icons';

interface TaskActionButtonProps {
    onClick: () => void;
    label: string;
    loading: boolean;
    disabled?: boolean;
    className?: string;
    success?: boolean;
}

const TaskActionButton: React.FC<TaskActionButtonProps> = ({ onClick, label, loading, disabled, className, success }) => {
    const baseClasses = "w-full text-center font-bold py-3 px-6 rounded-lg text-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50";
    
    if (success) {
        return (
             <div className={`${baseClasses} ${className} flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600`}>
                <CheckIcon className="h-6 w-6 mr-2"/>
                {label} Complete
            </div>
        )
    }

    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            className={`${baseClasses} ${className} ${disabled ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'btn-neon hover:scale-105'}`}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </div>
            ) : (
                label
            )}
        </button>
    );
};

export default TaskActionButton;
